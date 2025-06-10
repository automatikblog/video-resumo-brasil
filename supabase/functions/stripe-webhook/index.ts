
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

    // Verify webhook signature (you'll need to add webhook endpoint secret)
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    console.log(`Received Stripe webhook: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log(`Processing checkout session: ${session.id}`);
      
      const userId = session.client_reference_id;
      const creditsToAdd = parseInt(session.metadata?.credits || "0");
      
      if (!userId || !creditsToAdd) {
        console.error("Missing user ID or credits in session metadata");
        return new Response("Missing required data", { status: 400 });
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

      console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
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
