
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { supabase } from '@/integrations/supabase/client';

// Initialize the agent for fingerprinting
const fpPromise = FingerprintJS.load();

// Get visitor fingerprint
export const getFingerprint = async (): Promise<string> => {
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
};

// Track anonymous user usage
export const trackAnonymousUser = async (fingerprint: string): Promise<number> => {
  // First try to get the existing record
  const { data: existingUser } = await supabase
    .from('users_anonymous')
    .select('*')
    .eq('fingerprint', fingerprint)
    .maybeSingle();

  if (existingUser) {
    // Update usage count and last_used
    const { data, error } = await supabase
      .from('users_anonymous')
      .update({
        usage_count: existingUser.usage_count + 1,
        last_used: new Date().toISOString(),
      })
      .eq('fingerprint', fingerprint)
      .select('usage_count')
      .single();

    if (error) {
      console.error('Error updating anonymous user:', error);
      throw error;
    }

    return data.usage_count;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('users_anonymous')
      .insert({
        fingerprint,
        usage_count: 1,
      })
      .select('usage_count')
      .single();

    if (error) {
      console.error('Error creating anonymous user:', error);
      throw error;
    }

    return data.usage_count;
  }
};

// Check if anonymous user has reached the usage limit
export const checkAnonymousUserLimit = async (fingerprint: string, limit: number = 3): Promise<boolean> => {
  const usageCount = await trackAnonymousUser(fingerprint);
  return usageCount <= limit;
};
