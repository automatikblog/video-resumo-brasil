
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Missing stripe-signature header");
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.warn("STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
    }

    let event;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body);
    }

    console.log(`Received Stripe webhook: ${event.type}`);

    // Handle subscription events
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;
      const planType = subscription.metadata?.planType;

      console.log(`Processing subscription ${event.type} for user ${userId}, plan: ${planType}`);

      if (!userId || !planType) {
        console.error("Missing userId or planType in subscription metadata");
        return new Response("Missing required data", { status: 400 });
      }

      // Map plan types to video limits
      const videoLimits: Record<string, number> = {
        student: 10,
        pro: 40,
        master: 150
      };

      const videoLimit = videoLimits[planType] || 0;

      // Update user profile with subscription info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_plan: planType,
          subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
          stripe_subscription_id: subscription.id,
          subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          monthly_videos_limit: videoLimit,
          monthly_videos_used: event.type === "customer.subscription.created" ? 0 : undefined, // Reset only on creation
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        throw updateError;
      }

      console.log(`Subscription ${event.type} processed successfully for user ${userId}`);

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Handle subscription deletion (cancellation)
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      console.log(`Processing subscription deletion for user ${userId}`);

      if (!userId) {
        console.error("Missing userId in subscription metadata");
        return new Response("Missing required data", { status: 400 });
      }

      // Update user profile - set to inactive/cancelled
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          subscription_end_date: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating cancelled subscription:', updateError);
        throw updateError;
      }

      console.log(`Subscription cancellation processed for user ${userId}`);

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Handle invoice payment succeeded (for monthly renewals)
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Only reset counter for subscription renewals, not initial payments
      if (invoice.billing_reason === 'subscription_cycle' && invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const userId = subscription.metadata?.userId;

        if (userId) {
          console.log(`Resetting monthly video counter for user ${userId} on renewal`);

          // Reset monthly video counter
          const { error: resetError } = await supabase
            .from('profiles')
            .update({
              monthly_videos_used: 0,
              subscription_start_date: new Date(subscription.current_period_start * 1000).toISOString(),
              subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', userId);

          if (resetError) {
            console.error('Error resetting video counter:', resetError);
            throw resetError;
          }

          console.log(`Monthly video counter reset successfully for user ${userId}`);
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Handle one-time checkout sessions (credits)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`Processing checkout session: ${session.id}`);
      
      const userId = session.client_reference_id;
      const creditsToAdd = parseInt(session.metadata?.credits || "0");
      
      if (!userId || !creditsToAdd) {
        console.error("Missing user ID or credits in session metadata");
        return new Response("Missing required data", { status: 400 });
      }

      // Check if already processed
      const { data: existingRecord } = await supabase
        .from('payment_sessions')
        .select('*')
        .eq('session_id', session.id)
        .maybeSingle();

      if (existingRecord) {
        console.log('Webhook: Credits already processed for this session');
        return new Response(JSON.stringify({ received: true, already_processed: true }), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Add credits to user account
      const { data: existingCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user credits:', fetchError);
        throw fetchError;
      }

      if (existingCredits) {
        // Update existing credits
        const newTotal = existingCredits.credits + creditsToAdd;
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits: newTotal })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating credits:', updateError);
          throw updateError;
        }
      } else {
        // Create new credits record
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert([{ user_id: userId, credits: creditsToAdd }]);

        if (insertError) {
          console.error('Error inserting credits:', insertError);
          throw insertError;
        }
      }

      // Record this payment session
      await supabase
        .from('payment_sessions')
        .insert([{
          session_id: session.id,
          user_id: userId,
          credits_added: creditsToAdd,
          processed_at: new Date().toISOString()
        }]);

      console.log(`Webhook: Successfully added ${creditsToAdd} credits to user ${userId}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
