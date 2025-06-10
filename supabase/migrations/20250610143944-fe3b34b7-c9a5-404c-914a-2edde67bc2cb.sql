
-- Fix Function Search Path issues by setting search_path for database functions
ALTER FUNCTION public.handle_new_user() SET search_path = public, extensions;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, extensions;
ALTER FUNCTION public.extract_youtube_video_id() SET search_path = public, extensions;

-- Configure Auth settings to address OTP and password protection warnings
-- Note: These are configuration changes that need to be done in Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Set OTP expiry to a reasonable time (default 1 hour is fine)
-- 3. Enable leaked password protection in the Auth settings

-- Add comments to document the manual steps needed
COMMENT ON FUNCTION public.handle_new_user() IS 'Function to create user profile on signup - search_path configured for security';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Function to update timestamps - search_path configured for security';
COMMENT ON FUNCTION public.extract_youtube_video_id() IS 'Function to extract YouTube video IDs - search_path configured for security';
