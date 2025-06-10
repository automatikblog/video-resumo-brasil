
-- Create payment_sessions table to track processed Stripe payments
CREATE TABLE public.payment_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  credits_added INTEGER NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX idx_payment_sessions_session_id ON public.payment_sessions(session_id);
CREATE INDEX idx_payment_sessions_user_id ON public.payment_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own payment sessions
CREATE POLICY "Users can view their own payment sessions" 
  ON public.payment_sessions 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Create policy for edge functions to insert payment sessions
CREATE POLICY "Edge functions can insert payment sessions" 
  ON public.payment_sessions 
  FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for user_credits table if they don't exist
DO $$ 
BEGIN
  -- Check if RLS is enabled on user_credits
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_credits' 
    AND policyname = 'Users can view their own credits'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
    
    -- Create policies for user_credits
    CREATE POLICY "Users can view their own credits" 
      ON public.user_credits 
      FOR SELECT 
      USING (user_id = auth.uid());
      
    CREATE POLICY "Edge functions can manage credits" 
      ON public.user_credits 
      FOR ALL 
      USING (true);
  END IF;
END $$;
