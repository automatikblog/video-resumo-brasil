
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
// Supadata API Key for transcript retrieval
const supadataApiKey = Deno.env.get('SUPADATA_API_KEY');

// Log environment variables (safely)
console.log('Environment check:', {
  hasYoutubeKey: !!youtubeApiKey,
  hasOpenAiKey: !!openAiApiKey,
  hasSupadataKey: !!supadataApiKey,
  supadataKeyPrefix: supadataApiKey ? supadataApiKey.substring(0, 10) + '...' : 'not set'
});

// Create a Supabase client with the Admin key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ProcessVideoRequest {
  id: string;           // The UUID of the record to process
  youtube_url: string;  // The YouTube URL
}

// Extract YouTube video ID from URL (including Shorts)
function extractYouTubeId(url: string): string | null {
  console.log(`Extracting video ID from URL: ${url}`);
  
  // Handle Shorts URLs: https://youtube.com/shorts/dQw4w9WgXcQ
  if (url.includes('/shorts/')) {
    const match = url.match(/\/shorts\/([^?&/#]+)/);
    const id = match ? match[1] : null;
    console.log(`Shorts URL detected, extracted ID: ${id}`);
    return id;
  }
  
  // Handle regular video URLs
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[7].length === 11) ? match[7] : null;
  console.log(`Regular video URL, extracted ID: ${id}`);
  return id;
}

// Extract YouTube playlist ID from URL
function extractYouTubePlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

// Check if URL is a playlist
function isPlaylist(url: string): boolean {
  return url.includes('list=');
}

// Check if URL is a Shorts video
function isShorts(url: string): boolean {
  return url.includes('/shorts/');
}

// Fetch transcript from Supadata API with better error handling
async function fetchTranscriptFromSupadata(videoId: string): Promise<string> {
  try {
    console.log(`Fetching transcript for video ID: ${videoId} from Supadata API`);
    
    const url = `https://api.supadata.ai/v1/youtube/transcript?url=https://www.youtube.com/watch?v=${videoId}&text=true`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': supadataApiKey || '',
        'Content-Type': 'application/json'
      },
    });

    console.log(`Supadata API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supadata API error: ${response.status} - ${errorText}`);
      
      // Try Shorts format if regular format fails
      if (response.status === 404 || response.status === 400) {
        console.log('Trying Shorts URL format...');
        const shortsUrl = `https://api.supadata.ai/v1/youtube/transcript?url=https://youtube.com/shorts/${videoId}&text=true`;
        
        const shortsResponse = await fetch(shortsUrl, {
          method: 'GET',
          headers: {
            'x-api-key': supadataApiKey || '',
            'Content-Type': 'application/json'
          },
        });
        
        console.log(`Shorts API response status: ${shortsResponse.status}`);
        
        if (shortsResponse.ok) {
          const shortsData = await shortsResponse.json();
          if (shortsData.content) {
            console.log(`Successfully retrieved transcript for Shorts video ID: ${videoId}`);
            return shortsData.content;
          }
        } else {
          const shortsErrorText = await shortsResponse.text();
          console.error(`Shorts API also failed: ${shortsResponse.status} - ${shortsErrorText}`);
        }
      }
      
      throw new Error(`Failed to fetch transcript: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Supadata API response data keys:', Object.keys(data));
    
    if (!data.content) {
      console.error('No transcript content in response:', data);
      throw new Error('No transcript content returned from Supadata API');
    }

    console.log(`Successfully retrieved transcript for video ID: ${videoId}, language: ${data.lang}, content length: ${data.content?.length || 0}`);
    return data.content;
  } catch (error) {
    console.error('Error fetching transcript from Supadata:', error);
    throw new Error(`Error fetching transcript: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Fetch playlist video IDs from Supadata API
async function fetchPlaylistVideosFromSupadata(playlistId: string): Promise<string[]> {
  try {
    console.log(`Fetching videos for playlist ID: ${playlistId} from Supadata API`);
    
    const url = `https://api.supadata.ai/v1/youtube/playlist/videos?id=${playlistId}&limit=20`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': supadataApiKey || '',
        'Content-Type': 'application/json'
      },
    });

    console.log(`Supadata playlist API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supadata API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch playlist videos: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Playlist API response data:', data);
    
    if (!data.videoIds || !Array.isArray(data.videoIds) || data.videoIds.length === 0) {
      console.error('No videoIds in playlist response:', data);
      throw new Error('No videos found in playlist or invalid response format');
    }

    console.log(`Successfully retrieved ${data.videoIds.length} videos from playlist:`, data.videoIds);
    return data.videoIds;
  } catch (error) {
    console.error('Error fetching playlist videos from Supadata:', error);
    throw error;
  }
}

// Fetches video details from YouTube API
async function fetchYouTubeVideoDetails(videoId: string) {
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
  
  return videoDetails.items[0];
}

// Process a single video
async function processSingleVideo(id: string, videoId: string): Promise<{transcript: string, summary: string}> {
  // 1. Get video details from YouTube API
  const videoDetails = await fetchYouTubeVideoDetails(videoId);
  
  const videoTitle = videoDetails.snippet.title;
  const videoDescription = videoDetails.snippet.description;
  const duration = videoDetails.contentDetails.duration;
  
  console.log(`Processing video: "${videoTitle}" with duration ${duration}`);
  
  // 2. Get transcript from Supadata API
  const transcript = await fetchTranscriptFromSupadata(videoId);
  
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
          content: `Summarize this YouTube video:\nTitle: "${videoTitle}"\nDescription: "${videoDescription}"\nTranscript: "${transcript.substring(0, 8000)}..."`
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
  
  return { transcript, summary };
}

// Process a playlist
async function processPlaylist(id: string, playlistId: string, url: string): Promise<{transcript: string, summary: string}> {
  // 1. Get playlist video IDs using the correct Supadata API
  const videoIds = await fetchPlaylistVideosFromSupadata(playlistId);
  
  console.log(`Processing playlist with ${videoIds.length} videos: ${videoIds.join(', ')}`);
  
  // 2. Get transcripts for all videos and concatenate them
  let combinedTranscript = `PLAYLIST TRANSCRIPTS FROM: ${url}\n\n`;
  const videoDetails = [];
  
  for (let i = 0; i < videoIds.length; i++) {
    const videoId = videoIds[i];
    try {
      console.log(`Processing video ${i + 1}/${videoIds.length}: ${videoId}`);
      
      // Get video details
      const details = await fetchYouTubeVideoDetails(videoId);
      videoDetails.push({
        id: videoId,
        title: details.snippet.title,
        description: details.snippet.description
      });
      
      // Get transcript
      const transcript = await fetchTranscriptFromSupadata(videoId);
      
      combinedTranscript += `\n\n--- VIDEO ${i + 1}: ${details.snippet.title} (ID: ${videoId}) ---\n\n`;
      combinedTranscript += transcript;
      
      console.log(`Successfully processed video ${i + 1}: ${details.snippet.title}`);
      
      // Update database with progress
      await supabase
        .from('video_summaries')
        .update({ 
          transcript: combinedTranscript,
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
    } catch (error) {
      console.error(`Error processing video ${videoId}:`, error);
      combinedTranscript += `\n\n--- VIDEO ${i + 1}: ERROR PROCESSING (ID: ${videoId}) ---\n\n`;
      combinedTranscript += `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  
  // 3. Generate a summary of the entire playlist
  console.log('Generating summary for playlist with OpenAI...');
  
  // Create a condensed version of the transcript for the summary generation
  const playlistInfo = videoDetails.map((v, i) => `Video ${i + 1}: "${v.title}" (ID: ${v.id}) - ${v.description.substring(0, 100)}...`).join('\n');
  
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
          content: "You are a summarization assistant. Create a concise but comprehensive summary of the video playlist based on the transcript information from multiple videos."
        },
        {
          role: "user",
          content: `Summarize this YouTube playlist:\nPlaylist URL: ${url}\nVideos in playlist (${videoDetails.length} total):\n${playlistInfo}\n\nCombined Transcript (partial): "${combinedTranscript.substring(0, 8000)}..."`
        }
      ],
    }),
  });
  
  if (!summaryResponse.ok) {
    throw new Error(`OpenAI API error for summary: ${await summaryResponse.text()}`);
  }
  
  const summaryData = await summaryResponse.json();
  const summary = summaryData.choices[0].message.content;
  
  console.log('Playlist summary generated');
  
  return { transcript: combinedTranscript, summary };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestData: ProcessVideoRequest;
  
  try {
    // Parse the request body
    requestData = await req.json();
    console.log('Processing video request:', {
      id: requestData.id,
      url: requestData.youtube_url,
      urlType: isPlaylist(requestData.youtube_url) ? 'playlist' : 
               isShorts(requestData.youtube_url) ? 'shorts' : 'regular'
    });
    
    const { id, youtube_url } = requestData;

    if (!id || !youtube_url) {
      console.error('Missing required fields:', { id: !!id, youtube_url: !!youtube_url });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id and youtube_url are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update status to processing
    console.log(`Updating record ${id} status to processing`);
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

    let videoId: string | null = null;
    let playlistId: string | null = null;
    let transcript: string = '';
    let summary: string = '';
    
    // Check if it's a playlist or single video
    if (isPlaylist(youtube_url)) {
      // Process as playlist
      playlistId = extractYouTubePlaylistId(youtube_url);
      
      if (!playlistId) {
        throw new Error('Invalid YouTube Playlist URL - could not extract playlist ID');
      }
      
      console.log(`Processing playlist with ID: ${playlistId}`);
      const result = await processPlaylist(id, playlistId, youtube_url);
      transcript = result.transcript;
      summary = result.summary;
      
      // Get the first video ID for reference (if available in URL)
      videoId = extractYouTubeId(youtube_url) || null;
    } else {
      // Process as single video (including Shorts)
      videoId = extractYouTubeId(youtube_url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL - could not extract video ID');
      }
      
      const videoType = isShorts(youtube_url) ? 'Shorts' : 'regular';
      console.log(`Processing ${videoType} video with ID: ${videoId}`);
      const result = await processSingleVideo(id, videoId);
      transcript = result.transcript;
      summary = result.summary;
    }
    
    // 4. Update the database with the transcript and summary
    console.log(`Updating database with results for record ${id}`);
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
      console.error('Error updating database:', error);
      throw new Error(`Failed to update database: ${error.message}`);
    }

    console.log('Database updated successfully with transcript and summary');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processed successfully',
        videoId,
        videoType: isPlaylist(youtube_url) ? 'playlist' : isShorts(youtube_url) ? 'shorts' : 'video'
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    // Try to update the record status to failed with detailed error message
    try {
      if (requestData?.id) {
        const detailedError = {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          timestamp: new Date().toISOString(),
          url: requestData.youtube_url
        };
        
        console.log('Updating record with failure details:', detailedError);
        
        await supabase
          .from('video_summaries')
          .update({ 
            status: 'failed', 
            error_message: JSON.stringify(detailedError),
            updated_at: new Date().toISOString()
          })
          .eq('id', requestData.id);
      }
    } catch (updateError) {
      console.error('Error updating failure status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process video', 
        details: error instanceof Error ? error.message : 'Unknown error',
        url: requestData?.youtube_url || 'unknown'
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
