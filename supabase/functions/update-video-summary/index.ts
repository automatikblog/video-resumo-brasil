
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateSummaryRequest {
  id: string;        // The UUID of the record to update
  summary: string;   // The summary text
  status?: string;   // Optional status update
  is_playlist?: boolean; // Whether this is a playlist summary
  error_message?: string; // Optional error message if processing failed
}

// Create a Supabase client with the Admin key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body and extract needed fields
    const requestData = await req.json();
    console.log('Received update request:', requestData);
    
    const { id, summary, status = 'completed', is_playlist = false, error_message } = requestData as UpdateSummaryRequest;

    // Validate required fields
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: id' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For failed status, we allow updating without a summary but with an error message
    if (status !== 'failed' && !summary) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: summary' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare update data
    const updateData: Record<string, any> = { 
      status,
      is_playlist,
      updated_at: new Date().toISOString()
    };

    // Add summary if provided
    if (summary) {
      updateData.summary = summary;
    }

    // Add error message if provided
    if (error_message) {
      updateData.error_message = error_message;
    }

    // Verify the record exists before updating
    const { data: existingRecord, error: fetchError } = await supabase
      .from('video_summaries')
      .select('id')
      .eq('id', id)
      .single();
      
    if (fetchError || !existingRecord) {
      console.error('Record not found or error fetching:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Record not found', details: fetchError || 'No record with this ID exists' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log for debugging
    console.log(`Updating video summary [${id}], status: ${status}, is_playlist: ${is_playlist}`);

    // Update the video summary in the database
    const { error } = await supabase
      .from('video_summaries')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating video summary:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update video summary', details: error }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-video-summary function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
