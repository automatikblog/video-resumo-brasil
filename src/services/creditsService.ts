
import { supabase } from "@/integrations/supabase/client";

export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await (supabase as any)
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No record found, create one with 0 credits
        await createUserCredits(userId, 0);
        return 0;
      }
      throw error;
    }

    return data?.credits || 0;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
};

export const createUserCredits = async (userId: string, credits: number = 0): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('user_credits')
      .insert([{ user_id: userId, credits }]);

    if (error) {
      console.error('Error creating user credits:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating user credits:', error);
    throw error;
  }
};

export const updateUserCredits = async (userId: string, credits: number): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from('user_credits')
      .update({ credits, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
};

export const addCreditsToUser = async (userId: string, creditsToAdd: number): Promise<void> => {
  try {
    // First, get current credits
    const currentCredits = await getUserCredits(userId);
    const newCredits = currentCredits + creditsToAdd;
    
    // Update with new total
    await updateUserCredits(userId, newCredits);
  } catch (error) {
    console.error('Error adding credits to user:', error);
    throw error;
  }
};

export const deductCreditsFromUser = async (userId: string, creditsToDeduct: number): Promise<boolean> => {
  try {
    // First, get current credits
    const currentCredits = await getUserCredits(userId);
    
    if (currentCredits < creditsToDeduct) {
      return false; // Not enough credits
    }
    
    const newCredits = currentCredits - creditsToDeduct;
    await updateUserCredits(userId, newCredits);
    return true;
  } catch (error) {
    console.error('Error deducting credits from user:', error);
    return false;
  }
};
