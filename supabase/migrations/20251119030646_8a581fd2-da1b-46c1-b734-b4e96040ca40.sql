-- Add subscription tracking columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'student', 'pro', 'master')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'expired')),
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS monthly_videos_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_videos_limit INTEGER DEFAULT 0;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Add comment explaining the subscription system
COMMENT ON COLUMN profiles.subscription_plan IS 'User subscription plan: free, student (10 videos), pro (40 videos), or master (150 videos)';
COMMENT ON COLUMN profiles.monthly_videos_used IS 'Number of videos processed this billing period, resets monthly';
COMMENT ON COLUMN profiles.monthly_videos_limit IS 'Maximum videos allowed per month based on subscription plan';