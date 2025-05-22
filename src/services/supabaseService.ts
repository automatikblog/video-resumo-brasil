
import { supabase } from "@/integrations/supabase/client";
import { VideoSummary } from "@/types/videoSummary";

/**
 * Saves a YouTube URL to Supabase and returns the created record
 */
export const saveYouTubeUrl = async (
  url: string, 
  userId?: string | null, 
  fingerprint?: string | null,
  isPlaylist: boolean = false
): Promise<VideoSummary> => {
  console.log('Saving YouTube URL:', { url, userId, fingerprint, isPlaylist });
  
  // Define the insert data as a more flexible type that can accept our conditionally added fields
  const insertData: {
    youtube_url: string;
    is_playlist: boolean;
    status: string;
    user_id?: string;
    fingerprint?: string;
  } = { 
    youtube_url: url,
    is_playlist: isPlaylist,
    status: 'pending'
  };
  
  // Add user_id if authenticated
  if (userId) {
    insertData.user_id = userId;
  }
  
  // Add fingerprint for anonymous users
  if (!userId && fingerprint) {
    insertData.fingerprint = fingerprint;
  }

  try {
    const { data, error } = await supabase
      .from('video_summaries')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Error saving YouTube URL:', error);
      throw new Error(`Failed to save video URL: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned after inserting video URL');
    }

    console.log('Video summary record created:', data);

    // Call the webhook to process the video
    await triggerSummaryGeneration(data.id, url);

    // Type assertion to ensure the status is one of the expected values
    return {
      ...data,
      status: data.status as VideoSummary['status']
    };
  } catch (error) {
    console.error('Failed in saveYouTubeUrl:', error);
    throw error;
  }
};

/**
 * Triggers the external webhook to generate a summary for the video
 */
const triggerSummaryGeneration = async (id: string, url: string): Promise<void> => {
  try {
    console.log('Triggering summary generation for:', { id, url });
    
    const response = await fetch('https://webhooks.automatiklabs.com/webhook/resume-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,  // The UUID to identify this record
        youtube_url: url
      })
    });

    console.log('Webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook returned status ${response.status}:`, errorText);
      throw new Error(`Webhook returned status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Successfully triggered summary generation:', responseData);
  } catch (error) {
    console.error('Error triggering summary generation:', error);
    // We're not rethrowing here as we want the UI to continue showing the pending status
    // The webhook might still process the request despite the error
  }
};

/**
 * Resume processing a video or playlist that previously failed
 */
export const resumeVideoProcessing = async (id: string, url: string, isPlaylist: boolean = false): Promise<void> => {
  console.log('Resuming video processing:', { id, url, isPlaylist });
  
  // First update the record status
  const { error: updateError } = await supabase
    .from('video_summaries')
    .update({ 
      status: 'pending',
      updated_at: new Date().toISOString(),
      error_message: null // Clear any previous error message
    })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating video status:', updateError);
    throw new Error('Failed to update video status');
  }

  // Then trigger the webhook to process it again
  await triggerSummaryGeneration(id, url);
};

/**
 * Gets a video summary by its ID
 */
export const getVideoSummary = async (id: string): Promise<VideoSummary | null> => {
  console.log('Fetching video summary:', id);
  
  const { data, error } = await supabase
    .from('video_summaries')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching summary:', error);
    throw new Error('Failed to fetch video summary');
  }

  if (!data) {
    console.log('No video summary found for ID:', id);
    return null;
  }

  console.log('Retrieved video summary:', data);

  // Type assertion to ensure the status is one of the expected values
  return {
    ...data,
    status: data.status as VideoSummary['status']
  };
};

/**
 * Polls for a video summary until it's ready or times out
 */
export const pollForVideoSummary = async (
  id: string, 
  maxAttempts: number = 30, 
  intervalMs: number = 3000
): Promise<VideoSummary | null> => {
  console.log(`Starting polling for video summary ${id}. Max attempts: ${maxAttempts}, Interval: ${intervalMs}ms`);
  
  let attempts = 0;

  while (attempts < maxAttempts) {
    const summary = await getVideoSummary(id);
    attempts++;
    
    console.log(`Poll attempt ${attempts}/${maxAttempts}:`, summary?.status);
    
    if (!summary) {
      console.log('No summary found during polling');
      return null;
    }

    if (summary.summary || summary.status === 'completed') {
      console.log('Summary completed successfully');
      return summary;
    }

    if (summary.status === 'failed') {
      console.error('Summary generation failed:', summary.error_message);
      throw new Error(`Summary generation failed: ${summary.error_message || 'Unknown error'}`);
    }

    // Wait for the specified interval
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  console.warn(`Timed out waiting for summary after ${maxAttempts} attempts`);
  throw new Error('Timed out waiting for summary');
};

/**
 * Gets all video summaries for the current user
 */
export const getUserSummaries = async (userId?: string | null): Promise<VideoSummary[]> => {
  if (!userId) {
    console.log('No userId provided to getUserSummaries');
    return [];
  }

  console.log('Fetching summaries for user:', userId);
  
  const { data, error } = await supabase
    .from('video_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user summaries:', error);
    throw new Error('Failed to fetch summaries');
  }

  console.log(`Retrieved ${data.length} summaries for user`);
  
  return data.map(summary => ({
    ...summary,
    status: summary.status as VideoSummary['status']
  }));
};
