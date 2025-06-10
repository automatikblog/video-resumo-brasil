import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// YouTube API Key for extracting video metadata
const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
// Gemini API Key for transcription and summarization
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
// Supadata API Key for transcript retrieval
const supadataApiKey = Deno.env.get('SUPADATA_API_KEY');

// Log environment variables (safely)
console.log('Environment check:', {
  hasYoutubeKey: !!youtubeApiKey,
  hasGeminiKey: !!geminiApiKey,
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

// Helper function to introduce a delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to deduct user credits
const deductUserCredits = async (userId: string, creditsToDeduct: number): Promise<boolean> => {
  console.log(`Deducting ${creditsToDeduct} credits from user: ${userId}`);
  
  try {
    // Get current credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();

    if (creditsError) {
      console.error('Error fetching user credits:', creditsError);
      return false;
    }

    const currentCredits = creditsData?.credits || 0;
    
    if (currentCredits < creditsToDeduct) {
      console.log(`Insufficient credits: ${currentCredits} available, ${creditsToDeduct} needed`);
      return false;
    }

    const newCredits = currentCredits - creditsToDeduct;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return false;
    }

    console.log(`Successfully deducted ${creditsToDeduct} credits. New balance: ${newCredits}`);
    return true;
  } catch (error) {
    console.error('Error in deductUserCredits:', error);
    return false;
  }
};

// Helper function to refund user credits
const refundUserCredits = async (userId: string, creditsToRefund: number): Promise<void> => {
  console.log(`Refunding ${creditsToRefund} credits to user: ${userId}`);
  
  try {
    // Get current credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();

    if (creditsError) {
      console.error('Error fetching user credits for refund:', creditsError);
      return;
    }

    const currentCredits = creditsData?.credits || 0;
    const newCredits = currentCredits + creditsToRefund;
    
    // Update credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error refunding user credits:', updateError);
    } else {
      console.log(`Successfully refunded ${creditsToRefund} credits. New balance: ${newCredits}`);
    }
  } catch (error) {
    console.error('Error in refundUserCredits:', error);
  }
};

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
    console.log(`Using API key prefix: ${supadataApiKey ? supadataApiKey.substring(0, 20) + '...' : 'not set'}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': supadataApiKey || '',
        'Content-Type': 'application/json'
      },
    });

    console.log(`Supadata playlist API response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supadata API error: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch playlist videos: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Playlist API response data structure:', {
      hasVideoIds: !!data.videoIds,
      hasShortIds: !!data.shortIds,
      hasLiveIds: !!data.liveIds,
      videoIdsLength: data.videoIds?.length || 0,
      shortIdsLength: data.shortIds?.length || 0,
      liveIdsLength: data.liveIds?.length || 0,
      rawData: data
    });
    
    // Collect all video IDs from different arrays
    const allVideoIds = [];
    
    if (data.videoIds && Array.isArray(data.videoIds)) {
      allVideoIds.push(...data.videoIds);
      console.log(`Added ${data.videoIds.length} regular video IDs`);
    }
    
    if (data.shortIds && Array.isArray(data.shortIds)) {
      allVideoIds.push(...data.shortIds);
      console.log(`Added ${data.shortIds.length} shorts IDs`);
    }
    
    if (data.liveIds && Array.isArray(data.liveIds)) {
      allVideoIds.push(...data.liveIds);
      console.log(`Added ${data.liveIds.length} live video IDs`);
    }
    
    // Remove duplicates
    const uniqueVideoIds = [...new Set(allVideoIds)];
    
    if (uniqueVideoIds.length === 0) {
      console.error('No videos found in playlist response:', data);
      throw new Error('No videos found in playlist or invalid response format');
    }

    console.log(`Successfully retrieved ${uniqueVideoIds.length} unique videos from playlist:`, uniqueVideoIds);
    return uniqueVideoIds;
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

// Generate a summary using Gemini API
async function generateSummaryWithGemini(title: string, description: string, transcript: string): Promise<string> {
  console.log('Generating summary with Gemini...');
  
  // Truncate transcript if too long (Gemini has input limits)
  const truncatedTranscript = transcript.length > 8000 ? transcript.substring(0, 8000) + "..." : transcript;
  
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          { 
            text: `Summarize this YouTube video:
Title: "${title}"
Description: "${description}"
Transcript: "${truncatedTranscript}"`
          }
        ]
      }
    ]
  };
  
  const summaryResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }
  );
  
  if (!summaryResponse.ok) {
    const errorText = await summaryResponse.text();
    throw new Error(`Gemini API error: ${summaryResponse.status} - ${errorText}`);
  }
  
  const summaryData = await summaryResponse.json();
  
  console.log('Gemini API response structure:', {
    hasCandidates: !!summaryData.candidates,
    candidatesLength: summaryData.candidates?.length || 0,
    firstCandidate: summaryData.candidates?.[0] || null
  });
  
  // Fixed: Use the correct response structure for Gemini API
  if (!summaryData.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.error('Invalid Gemini API response structure:', summaryData);
    throw new Error(`Invalid Gemini API response structure: ${JSON.stringify(summaryData).substring(0, 100)}...`);
  }
  
  const summary = summaryData.candidates[0].content.parts[0].text;
  console.log('Summary generated successfully');
  
  return summary;
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
  
  // 3. Generate a summary using Gemini
  const summary = await generateSummaryWithGemini(videoTitle, videoDescription, transcript);
  
  return { transcript, summary };
}

// Process a playlist
async function processPlaylist(id: string, playlistId: string, url: string, userId?: string): Promise<{transcript: string, summary: string, creditsUsed: number}> {
  try {
    console.log(`Starting playlist processing for ID: ${playlistId}`);
    
    // 1. Get playlist video IDs using the correct Supadata API
    const videoIds = await fetchPlaylistVideosFromSupadata(playlistId);
    
    console.log(`Processing playlist with ${videoIds.length} videos: ${videoIds.join(', ')}`);
    
    // 2. Get transcripts for all videos and concatenate them
    let combinedTranscript = `PLAYLIST TRANSCRIPTS FROM: ${url}\n\n`;
    const videoDetails = [];
    let processedCount = 0;
    let successCount = 0;
    let creditsUsed = 0;
    
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      try {
        console.log(`Processing video ${i + 1}/${videoIds.length}: ${videoId}`);
        
        // Deduct credits for each video if user is authenticated
        if (userId) {
          const hasCredits = await deductUserCredits(userId, 1);
          if (!hasCredits) {
            console.log(`User ${userId} has insufficient credits for video ${i + 1}, stopping playlist processing`);
            break;
          }
          creditsUsed += 1;
        }
        
        // Add a delay before each API call to respect rate limits (including the first one)
        if (i >= 0) {
          console.log(`Waiting 2 seconds before processing video ${i + 1} to avoid rate limiting...`);
          await sleep(2000);
        }
        
        // Get video details
        const details = await fetchYouTubeVideoDetails(videoId);
        videoDetails.push({
          id: videoId,
          title: details.snippet.title,
          description: details.snippet.description
        });
        
        // Get transcript
        const transcript = await fetchTranscriptFromSupadata(videoId);
        
        // Add clear separation with video title, number, and horizontal rules
        combinedTranscript += `\n\n${'='.repeat(80)}\n`;
        combinedTranscript += `VIDEO ${i + 1}: ${details.snippet.title} (ID: ${videoId})\n`;
        combinedTranscript += `${'='.repeat(80)}\n\n`;
        combinedTranscript += transcript;
        
        successCount++;
        console.log(`Successfully processed video ${i + 1}: ${details.snippet.title}`);
        
      } catch (error) {
        console.error(`Error processing video ${videoId}:`, error);
        
        // Refund credit for failed video if user is authenticated
        if (userId && creditsUsed > 0) {
          await refundUserCredits(userId, 1);
          creditsUsed -= 1;
        }
        
        // Add error information to transcript with clear formatting
        combinedTranscript += `\n\n${'='.repeat(80)}\n`;
        combinedTranscript += `VIDEO ${i + 1}: ERROR PROCESSING (ID: ${videoId})\n`;
        combinedTranscript += `${'='.repeat(80)}\n\n`;
        combinedTranscript += `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
      
      processedCount++;
      
      // Update database with progress every few videos
      if (processedCount % 3 === 0 || processedCount === videoIds.length) {
        console.log(`Updating progress: ${processedCount}/${videoIds.length} videos processed (${successCount} successful, ${creditsUsed} credits used)`);
        await supabase
          .from('video_summaries')
          .update({ 
            transcript: combinedTranscript,
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      }
    }
    
    console.log(`Playlist processing complete: ${successCount}/${videoIds.length} videos processed successfully, ${creditsUsed} credits used`);
    
    // 3. Generate a summary of the entire playlist with Gemini
    const playlistInfo = videoDetails.map((v, i) => 
      `Video ${i + 1}: "${v.title}" (ID: ${v.id}) - ${v.description.substring(0, 100)}...`
    ).join('\n');
    
    // Create a condensed version of the transcript for the summary generation
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            { 
              text: `Summarize this YouTube playlist:
Playlist URL: ${url}
Videos in playlist (${videoDetails.length} total):
${playlistInfo}

Combined Transcript (partial): "${combinedTranscript.substring(0, 8000)}..."`
            }
          ]
        }
      ]
    };
    
    const summaryResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text();
      console.error(`Gemini API error for summary: ${summaryResponse.status} - ${errorText}`);
      throw new Error(`Gemini API error for summary: ${summaryResponse.status} - ${errorText}`);
    }
    
    const summaryData = await summaryResponse.json();
    
    // Fixed: Use the correct response structure for Gemini API
    if (!summaryData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error(`Unexpected Gemini API response format: ${JSON.stringify(summaryData)}`);
    }
    
    const summary = summaryData.candidates[0].content.parts[0].text;
    console.log('Playlist summary generated successfully');
    
    return { transcript: combinedTranscript, summary, creditsUsed };
    
  } catch (error) {
    console.error('Error in processPlaylist:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  let requestData: ProcessVideoRequest;
  let userId: string | null = null;
  
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

    // Get user ID from the video summary record
    const { data: summaryData, error: summaryError } = await supabase
      .from('video_summaries')
      .select('user_id')
      .eq('id', id)
      .single();

    if (summaryError) {
      console.error('Error fetching video summary:', summaryError);
    } else {
      userId = summaryData?.user_id || null;
      console.log('Found user ID:', userId);
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
    let creditsUsed = 0;
    
    // Check if it's a playlist or single video
    if (isPlaylist(youtube_url)) {
      // Process as playlist
      playlistId = extractYouTubePlaylistId(youtube_url);
      
      if (!playlistId) {
        throw new Error('Invalid YouTube Playlist URL - could not extract playlist ID');
      }
      
      console.log(`Processing playlist with ID: ${playlistId}`);
      const result = await processPlaylist(id, playlistId, youtube_url, userId);
      transcript = result.transcript;
      summary = result.summary;
      creditsUsed = result.creditsUsed;
      
      // Get the first video ID for reference (if available in URL)
      videoId = extractYouTubeId(youtube_url) || null;
    } else {
      // Process as single video (including Shorts) - 1 credit already deducted in saveYouTubeUrl
      videoId = extractYouTubeId(youtube_url);
      
      if (!videoId) {
        throw new Error('Invalid YouTube URL - could not extract video ID');
      }
      
      const videoType = isShorts(youtube_url) ? 'Shorts' : 'regular';
      console.log(`Processing ${videoType} video with ID: ${videoId}`);
      
      try {
        const result = await processSingleVideo(id, videoId);
        transcript = result.transcript;
        summary = result.summary;
        creditsUsed = 1; // Single video costs 1 credit
      } catch (error) {
        // Refund credit for failed single video if user is authenticated
        if (userId) {
          await refundUserCredits(userId, 1);
        }
        throw error;
      }
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
        videoType: isPlaylist(youtube_url) ? 'playlist' : isShorts(youtube_url) ? 'shorts' : 'video',
        creditsUsed
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
