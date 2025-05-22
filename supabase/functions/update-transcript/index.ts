
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateTranscriptRequest {
  id: string;           // The UUID of the record to update
  transcript: string;   // The transcript text
  summary?: string;     // Optional summary text
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
    console.log('Received transcript update request:', requestData);
    
    const { id, transcript, summary } = requestData as UpdateTranscriptRequest;

    // Validate required fields
    if (!id || !transcript) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: id and transcript are required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
    console.log(`Updating content for video [${id}]`);

    // Prepare the update data
    const updateData: {
      transcript: string;
      updated_at: string;
      status?: string;
      summary?: string;
    } = {
      transcript: transcript,
      updated_at: new Date().toISOString()
    };

    // Add summary if provided
    if (summary) {
      updateData.summary = summary;
      updateData.status = 'completed'; // Mark as completed if summary is provided
    }

    // Update the video transcript in the database
    const { error } = await supabase
      .from('video_summaries')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating content:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update content', details: error }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: summary ? 'Transcript and summary updated successfully' : 'Transcript updated successfully'
      }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-transcript function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
