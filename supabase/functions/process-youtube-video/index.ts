
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
    
    // 2. Get transcript from YouTube captions API if available
    // Note: This is placeholder for future implementation - YouTube API doesn't directly provide transcripts
    // In a real implementation, you would need to integrate with a service like Google Speech API,
    // extract audio from the video, or use OpenAI's Whisper API with the actual audio
    
    console.log('Generating transcript with OpenAI...');
    
    // Use OpenAI to generate an accurate transcript simulation based on the video details
    // This is more honest about the fact that we're not getting the real transcript yet
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
            content: "You are a video transcription assistant. The user will provide a YouTube video title and description. Acknowledge that you don't have access to the actual video content, but explain to the user how a proper transcript would be obtained (through YouTube's caption API or audio extraction and transcription). DO NOT create a fictional transcript."
          },
          {
            role: "user",
            content: `I need a transcript for a YouTube video with the following details:\nTitle: ${videoTitle}\nDescription: ${videoDescription}\nVideo ID: ${videoId}\nPlease acknowledge that you can't access the real transcript, and explain how one would be generated.`
          }
        ],
      }),
    });

    if (!transcriptResponse.ok) {
      throw new Error(`OpenAI API error: ${await transcriptResponse.text()}`);
    }

    const transcriptData = await transcriptResponse.json();
    const transcript = `Note: This is a placeholder. To obtain a real transcript, we would need to extract audio from the YouTube video with ID ${videoId} and use a transcription service like OpenAI's Whisper API. The video title is "${videoTitle}" and it appears to have a duration of ${duration}.\n\n${transcriptData.choices[0].message.content}`;
    
    console.log('Information about transcript generation provided');
    
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
            content: "You are a summarization assistant. Create a summary of the video based on its title and description. Acknowledge that this is not based on the full transcript since we don't have access to it yet."
          },
          {
            role: "user",
            content: `Summarize what you know about this YouTube video:\nTitle: "${videoTitle}"\nDescription: "${videoDescription}"\nPlease acknowledge this is based only on the metadata, not the actual video content.`
          }
        ],
      }),
    });
    
    if (!summaryResponse.ok) {
      throw new Error(`OpenAI API error for summary: ${await summaryResponse.text()}`);
    }
    
    const summaryData = await summaryResponse.json();
    const summary = `Note: This summary is based only on the video title and description, not the actual content.\n\n${summaryData.choices[0].message.content}`;
    
    console.log('Summary generated based on available metadata');
    
    // 4. Update the database with the transcript and summary
    const { error } = await supabase
      .from('video_summaries')
      .update({
        transcript: transcript,
        summary: summary,
        status: 'completed',
        updated_at: new Date().toISOString(),
        video_id: videoId // Also save the extracted video ID
      })
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update database: ${error.message}`);
    }

    console.log('Database updated successfully with transcript information and summary');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processed successfully',
        videoId,
        videoTitle,
        note: 'This is using simulated transcript data. For real transcripts, additional implementation is required.'
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Try to update the record status to failed
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
        .eq('id', id)
        .catch(err => console.error('Error updating failure status:', err));
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
