
import { supabase } from "@/integrations/supabase/client";

interface VideoSummary {
  id: string;
  youtube_url: string;
  video_id?: string;
  summary?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

/**
 * Saves a YouTube URL to Supabase and returns the created record
 */
export const saveYouTubeUrl = async (url: string): Promise<VideoSummary> => {
  const { data, error } = await supabase
    .from('video_summaries')
    .insert([{ youtube_url: url }])
    .select()
    .single();

  if (error) {
    console.error('Error saving YouTube URL:', error);
    throw new Error('Failed to save video URL');
  }

  // Call the webhook to process the video
  await triggerSummaryGeneration(data.id, url);

  // Type assertion to ensure the status is one of the expected values
  return {
    ...data,
    status: data.status as VideoSummary['status']
  };
};

/**
 * Triggers the external webhook to generate a summary for the video
 */
const triggerSummaryGeneration = async (id: string, url: string): Promise<void> => {
  try {
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

    if (!response.ok) {
      throw new Error(`Webhook returned status ${response.status}`);
    }

    console.log('Successfully triggered summary generation');
  } catch (error) {
    console.error('Error triggering summary generation:', error);
    // We're not rethrowing here as we want the UI to continue showing the pending status
    // The webhook might still process the request despite the error
  }
};

/**
 * Gets a video summary by its ID
 */
export const getVideoSummary = async (id: string): Promise<VideoSummary | null> => {
  const { data, error } = await supabase
    .from('video_summaries')
    .select()
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching summary:', error);
    throw new Error('Failed to fetch video summary');
  }

  if (!data) return null;

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
  let attempts = 0;

  while (attempts < maxAttempts) {
    const summary = await getVideoSummary(id);
    
    if (!summary) {
      return null;
    }

    if (summary.summary || summary.status === 'completed') {
      return summary;
    }

    if (summary.status === 'failed') {
      throw new Error('Summary generation failed');
    }

    // Wait for the specified interval
    await new Promise(resolve => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error('Timed out waiting for summary');
};
