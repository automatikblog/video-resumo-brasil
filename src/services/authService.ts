
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { getFingerprint } from "./fingerprintService";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Link anonymous transcripts to authenticated user
export const linkAnonymousTranscripts = async (userId: string) => {
  try {
    const fingerprint = await getFingerprint();
    
    // Update all video_summaries that belong to this fingerprint to now belong to the user
    const { error } = await supabase
      .from('video_summaries')
      .update({ 
        user_id: userId,
        fingerprint: null // Clear the fingerprint since it's now linked to a user
      })
      .eq('fingerprint', fingerprint)
      .is('user_id', null); // Only update records that don't already have a user_id

    if (error) {
      console.error('Error linking anonymous transcripts:', error);
      throw error;
    }

    console.log('Successfully linked anonymous transcripts to user:', userId);
  } catch (error) {
    console.error('Failed to link anonymous transcripts:', error);
    // Don't throw here - we don't want to break the auth flow if this fails
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Use dynamic origin instead of hardcoded localhost
    },
  });
  
  if (error) {
    throw error;
  }
};

// Sign Out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

// Get current session
export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

// Update user language preference
export const updateLanguagePreference = async (userId: string, language: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ preferred_language: language, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    throw error;
  }
};

// Get user profile with language preference
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
