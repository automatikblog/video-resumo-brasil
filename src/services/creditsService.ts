
import { supabase } from "@/integrations/supabase/client";

export const getUserCredits = async (userId: string): Promise<number> => {
  try {
    console.log('Fetching credits for user:', userId);
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        // No record found, create one with 0 credits
        console.log('No credits record found, creating new one');
        await createUserCredits(userId, 0);
        return 0;
      }
      console.error('Error fetching user credits:', error);
      throw error;
    }

    const credits = data?.credits || 0;
    console.log('User credits fetched:', credits);
    return credits;
  } catch (error) {
    console.error('Error in getUserCredits:', error);
    return 0;
  }
};

export const createUserCredits = async (userId: string, credits: number = 0): Promise<void> => {
  try {
    console.log('Creating credits record for user:', userId, 'with credits:', credits);
    
    const { error } = await supabase
      .from('user_credits')
      .insert([{ user_id: userId, credits }]);

    if (error) {
      console.error('Error creating user credits:', error);
      throw error;
    }
    
    console.log('Credits record created successfully');
  } catch (error) {
    console.error('Error in createUserCredits:', error);
    throw error;
  }
};

export const updateUserCredits = async (userId: string, credits: number): Promise<void> => {
  try {
    console.log('Updating credits for user:', userId, 'to:', credits);
    
    const { error } = await supabase
      .from('user_credits')
      .update({ credits, updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
    
    console.log('Credits updated successfully');
  } catch (error) {
    console.error('Error in updateUserCredits:', error);
    throw error;
  }
};

export const addCreditsToUser = async (userId: string, creditsToAdd: number): Promise<void> => {
  try {
    console.log('Adding credits to user:', userId, 'amount:', creditsToAdd);
    
    // First, get current credits
    const currentCredits = await getUserCredits(userId);
    const newCredits = currentCredits + creditsToAdd;
    
    console.log('Current credits:', currentCredits, 'New total:', newCredits);
    
    // Update with new total
    await updateUserCredits(userId, newCredits);
    
    console.log('Credits added successfully');
  } catch (error) {
    console.error('Error in addCreditsToUser:', error);
    throw error;
  }
};

export const deductCreditsFromUser = async (userId: string, creditsToDeduct: number): Promise<boolean> => {
  try {
    console.log('Deducting credits from user:', userId, 'amount:', creditsToDeduct);
    
    // First, get current credits
    const currentCredits = await getUserCredits(userId);
    
    if (currentCredits < creditsToDeduct) {
      console.log('Insufficient credits:', currentCredits, 'needed:', creditsToDeduct);
      return false; // Not enough credits
    }
    
    const newCredits = currentCredits - creditsToDeduct;
    console.log('Deducting credits, new total:', newCredits);
    
    await updateUserCredits(userId, newCredits);
    
    console.log('Credits deducted successfully');
    return true;
  } catch (error) {
    console.error('Error in deductCreditsFromUser:', error);
    return false;
  }
};
