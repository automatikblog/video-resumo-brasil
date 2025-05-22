
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// YouTube API Key for extracting video metadata
const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
// OpenAI API Key for transcription and summarization
const openAiApiKey = Deno.env.get('OPENAI_API_KEY');

// Create a Supabase client with the Admin key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ProcessVideoRequest {
  id: string;           // The UUID of the record to process
  youtube_url: string;  // The YouTube URL
}

// Extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}

// Fetches captions for a YouTube video
async function fetchYouTubeCaptions(videoId: string): Promise<string> {
  try {
    console.log(`Fetching captions for video ID: ${videoId}`);
    
    // Step 1: Get the caption tracks available for the video
    const captionTracksResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${youtubeApiKey}`
    );
    
    if (!captionTracksResponse.ok) {
      console.error(`Caption tracks API error: ${captionTracksResponse.status} - ${await captionTracksResponse.text()}`);
      throw new Error('Failed to fetch caption tracks from YouTube API');
    }
    
    const captionTracks = await captionTracksResponse.json();
    console.log(`Caption tracks response:`, captionTracks);
    
    // If there are captions available
    if (captionTracks.items && captionTracks.items.length > 0) {
      // Try to find English captions first, or use the first available track if no English
      let captionTrack = captionTracks.items.find((track: any) => 
        track.snippet.language === 'en' || track.snippet.language === 'en-US'
      ) || captionTracks.items[0];
      
      // Get the caption track ID
      const captionId = captionTrack.id;
      console.log(`Using caption track: ${captionId} (${captionTrack.snippet.language})`);
      
      // Step 2: Download the actual captions
      // Note: This would require OAuth 2.0 authentication which is not feasible in this context
      // Instead, we'll use a workaround to get transcript from video info
      
      // Use a third-party service or library that can extract subtitles
      // For now, let's notify that we found captions but need a different approach to fetch them
      return `Captions are available for this video (ID: ${captionId}, Language: ${captionTrack.snippet.language}). 
      However, retrieving the actual caption content requires OAuth 2.0 authentication with the YouTube API, 
      which isn't implemented in this edge function. A more specialized solution using youtube-transcript-api 
      or similar libraries would be needed for full caption extraction.`;
    } else {
      console.log('No caption tracks found for this video');
      return 'No captions found for this video. Either the video does not have captions or they are not publicly available.';
    }
  } catch (error) {
    console.error('Error fetching YouTube captions:', error);
    return `Error fetching captions: ${error instanceof Error ? error.message : String(error)}`;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData = await req.json();
    console.log('Processing video request:', requestData);
    
    const { id, youtube_url } = requestData as ProcessVideoRequest;

    if (!id || !youtube_url) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id and youtube_url are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to processing
    const { error: updateError } = await supabase
      .from('video_summaries')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating video status to processing:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update processing status', details: updateError }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the YouTube video ID
    const videoId = extractYouTubeId(youtube_url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL - could not extract video ID');
    }

    // 1. Get video details from YouTube API
    console.log(`Fetching details for YouTube video: ${videoId}`);
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,contentDetails`
    );
    
    if (!videoDetailsResponse.ok) {
      throw new Error(`YouTube API error: ${await videoDetailsResponse.text()}`);
    }
    
    const videoDetails = await videoDetailsResponse.json();
    
    if (!videoDetails.items || videoDetails.items.length === 0) {
      throw new Error('Video not found on YouTube');
    }
    
    const videoTitle = videoDetails.items[0].snippet.title;
    const videoDescription = videoDetails.items[0].snippet.description;
    const duration = videoDetails.items[0].contentDetails.duration;
    
    console.log(`Processing video: "${videoTitle}" with duration ${duration}`);
    
    // 2. Try to fetch transcript from YouTube captions
    console.log('Attempting to fetch YouTube captions...');
    const captionText = await fetchYouTubeCaptions(videoId);
    
    let transcript = captionText;
    
    // If captions weren't available or we couldn't get them, generate simulated transcript with disclaimer
    if (transcript.includes('Error fetching captions') || transcript.includes('No captions found')) {
      console.log('Generating transcript with OpenAI as fallback...');
      // Use OpenAI to generate a transcript simulation based on video details
      const transcriptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system", 
              content: "You are a video transcription assistant. The user will provide a YouTube video title and description. You should create a detailed, realistic transcript simulation based on this information. Format it as a full transcript with timestamps, dialog, and descriptions of what might be happening in the video. Make it as realistic as possible, while clearly indicating at the beginning that this is a simulated transcript."
            },
            {
              role: "user",
              content: `I need a simulated transcript for a YouTube video with the following details:\nTitle: ${videoTitle}\nDescription: ${videoDescription}\nVideo ID: ${videoId}\nDuration: ${duration}\n\nPlease format it like a real transcript with timestamps and dialog, but note that it's simulated.`
            }
          ],
        }),
      });

      if (!transcriptResponse.ok) {
        throw new Error(`OpenAI API error: ${await transcriptResponse.text()}`);
      }

      const transcriptData = await transcriptResponse.json();
      transcript = `[SIMULATED TRANSCRIPT - NOT THE ACTUAL VIDEO CONTENT]\n\nThe following is a simulation based on the video title and description, not the actual video content:\n\n${transcriptData.choices[0].message.content}`;
    }
    
    console.log('Transcript ready');
    
    // 3. Generate a summary using GPT-4
    console.log('Generating summary with OpenAI...');
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: "You are a summarization assistant. Create a concise but comprehensive summary of the video based on its title, description, and transcript information."
          },
          {
            role: "user",
            content: `Summarize this YouTube video:\nTitle: "${videoTitle}"\nDescription: "${videoDescription}"\nTranscript: "${transcript.substring(0, 4000)}..."`
          }
        ],
      }),
    });
    
    if (!summaryResponse.ok) {
      throw new Error(`OpenAI API error for summary: ${await summaryResponse.text()}`);
    }
    
    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;
    
    console.log('Summary generated');
    
    // 4. Update the database with the transcript and summary
    const { error } = await supabase
      .from('video_summaries')
      .update({
        transcript: transcript,
        summary: summary,
        status: 'completed',
        updated_at: new Date().toISOString(),
        video_id: videoId
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update database: ${error.message}`);
    }

    console.log('Database updated successfully with transcript and summary');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processed successfully',
        videoId,
        videoTitle
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Try to update the record status to failed
    try {
      const requestData = await req.json().catch(() => ({}));
      const { id } = requestData as Partial<ProcessVideoRequest>;
      
      if (id) {
        await supabase
          .from('video_summaries')
          .update({ 
            status: 'failed', 
            error_message: error instanceof Error ? error.message : 'Unknown error', 
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      }
    } catch (updateError) {
      console.error('Error updating failure status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process video', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
