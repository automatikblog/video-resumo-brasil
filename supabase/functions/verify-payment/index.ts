
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

    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error("Session ID is required");
    }

    console.log(`Verifying payment session: ${session_id}`);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (!session) {
      throw new Error("Session not found");
    }

    console.log(`Session status: ${session.payment_status}, mode: ${session.mode}`);

    if (session.payment_status !== "paid") {
      throw new Error(`Payment not completed. Status: ${session.payment_status}`);
    }

    // Verify this is a successful payment
    if (session.mode !== "payment") {
      throw new Error("Invalid session mode");
    }

    const userId = session.client_reference_id;
    const creditsToAdd = parseInt(session.metadata?.credits || "0");

    if (!userId || !creditsToAdd) {
      throw new Error("Missing user ID or credits in session metadata");
    }

    console.log(`Verified payment: ${creditsToAdd} credits for user ${userId}`);

    // Initialize Supabase with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Check if credits have already been added for this session
    const { data: existingRecord } = await supabase
      .from('payment_sessions')
      .select('*')
      .eq('session_id', session_id)
      .maybeSingle();

    if (existingRecord) {
      console.log('Credits already processed for this session');
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Credits already processed",
        already_processed: true
      }), {
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

    // Record this payment session to prevent double processing
    await supabase
      .from('payment_sessions')
      .insert([{
        session_id: session_id,
        user_id: userId,
        credits_added: creditsToAdd,
        processed_at: new Date().toISOString()
      }]);

    console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      credits_added: creditsToAdd,
      message: "Payment verified and credits added successfully"
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
