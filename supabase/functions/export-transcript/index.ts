
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// CORS headers for allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse request body to get transcript ID
    const { id, format, contentType } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Transcript ID is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch the transcript data from the database
    const { data: transcriptData, error: fetchError } = await supabase
      .from('video_summaries')
      .select('summary, transcript, youtube_url, video_id, created_at')
      .eq('id', id)
      .single();

    if (fetchError || !transcriptData) {
      console.error("Error fetching transcript:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch transcript data" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get video title from YouTube API
    const videoId = transcriptData.video_id;
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    let videoTitle = "YouTube Transcript";
    
    if (youtubeApiKey && videoId) {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet`);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          videoTitle = data.items[0].snippet.title;
        }
      } catch (error) {
        console.error("Error fetching video title:", error);
        // Continue without title if API fails
      }
    }

    let result;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Use transcript if requested and available, otherwise fall back to summary
    const content = contentType === 'transcript' && transcriptData.transcript 
      ? transcriptData.transcript 
      : contentType === 'summary' && transcriptData.summary
        ? transcriptData.summary
        : "No content available";
    
    const youtubeUrl = transcriptData.youtube_url || "";
    const createdAt = new Date(transcriptData.created_at).toLocaleDateString();
    const contentTypeLabel = contentType === 'transcript' ? 'Transcript' : 'Summary';

    // Create content based on requested format
    switch (format) {
      case 'txt':
        result = {
          content: `${videoTitle}\n\nURL: ${youtubeUrl}\n${contentTypeLabel} Date: ${createdAt}\n\n${content}`,
          fileName: `${contentType}-${timestamp}.txt`,
          contentType: 'text/plain'
        };
        break;
      
      case 'markdown':
      case 'md':
        result = {
          content: `# ${videoTitle}\n\n**URL:** ${youtubeUrl}\n**${contentTypeLabel} Date:** ${createdAt}\n\n${content}`,
          fileName: `${contentType}-${timestamp}.md`,
          contentType: 'text/markdown'
        };
        break;
      
      case 'json':
        result = {
          content: JSON.stringify({
            title: videoTitle,
            url: youtubeUrl,
            created_at: createdAt,
            contentType: contentTypeLabel.toLowerCase(),
            content: content
          }, null, 2),
          fileName: `${contentType}-${timestamp}.json`,
          contentType: 'application/json'
        };
        break;
      
      case 'html':
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${videoTitle} - ${contentTypeLabel}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { color: #333; }
    .meta { color: #666; margin-bottom: 20px; }
    .content { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>${videoTitle}</h1>
  <div class="meta">
    <p><strong>URL:</strong> <a href="${youtubeUrl}">${youtubeUrl}</a></p>
    <p><strong>${contentTypeLabel} Date:</strong> ${createdAt}</p>
  </div>
  <div class="content">${content}</div>
</body>
</html>`;
        result = {
          content: htmlContent,
          fileName: `${contentType}-${timestamp}.html`,
          contentType: 'text/html'
        };
        break;
      
      default:
        result = {
          content: `${videoTitle}\n\nURL: ${youtubeUrl}\n${contentTypeLabel} Date: ${createdAt}\n\n${content}`,
          fileName: `${contentType}-${timestamp}.txt`,
          contentType: 'text/plain'
        };
    }

    // Return the transcript data
    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        } 
      }
    );

  } catch (error) {
    console.error("Error in export-transcript function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to export transcript" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
