
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { packageName, credits, price } = await req.json();
    
    console.log(`Creating checkout for package: ${packageName}, credits: ${credits}, price: ${price}`);
    
    // Get user information from Supabase
    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase environment variables are not set");
    }
    
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "apikey": supabaseAnonKey,
      },
    });
    
    const userData = await userResponse.json();
    
    if (!userData || !userData.email) {
      throw new Error("Failed to get user information or user is not authenticated");
    }

    console.log(`Creating checkout for user: ${userData.email}`);
    
    // Check if customer already exists
    const customers = await stripe.customers.list({
      email: userData.email,
      limit: 1,
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Existing customer found: ${customerId}`);
    } else {
      console.log("Creating new customer");
    }
    
    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "https://video-resumo-brasil.lovable.app";
    
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userData.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} Credits - ${packageName}`,
              description: `${credits} video transcription credits`,
            },
            unit_amount: Math.round(parseFloat(price.replace('$', '')) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&credits=${credits}`,
      cancel_url: `${origin}/dashboard?tab=credits&cancelled=true`,
      client_reference_id: userData.id,
      metadata: {
        credits: credits.toString(),
        user_id: userData.id,
        package_name: packageName,
      },
    });
    
    console.log(`Checkout session created: ${session.id}`);
    console.log(`Success URL: ${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&credits=${credits}`);
    
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
    
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
