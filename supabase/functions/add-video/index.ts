import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoData {
  titel: string;
  describtion?: string;
  duration: string;
  embed: string;
  thumbnail?: string;
  tag_1?: string;
  tag_2?: string;
  tag_3?: string;
  tag_4?: string;
  tag_5?: string;
  tag_6?: string;
  tag_7?: string;
  tag_8?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  image_6?: string;
  image_7?: string;
  image_8?: string;
  image_9?: string;
  image_10?: string;
  image_11?: string;
  image_12?: string;
  image_13?: string;
  image_14?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Simple API key validation - in production, store these securely
    if (!apiKey.startsWith('admin_')) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const videoData: VideoData = await req.json();

    // Validate required fields
    if (!videoData.titel || !videoData.duration || !videoData.embed) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: titel, duration, and embed are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare data for insertion - support all columns
    const insertData: any = {
      titel: videoData.titel,
      describtion: videoData.describtion || null,
      duration: videoData.duration,
      embed: videoData.embed,
      thumbnail: videoData.thumbnail || null,
      tag_1: videoData.tag_1 || null,
      tag_2: videoData.tag_2 || null,
      tag_3: videoData.tag_3 || null,
      tag_4: videoData.tag_4 || null,
      tag_5: videoData.tag_5 || null,
      tag_6: videoData.tag_6 || null,
      tag_7: videoData.tag_7 || null,
      tag_8: videoData.tag_8 || null,
      image_1: videoData.image_1 || null,
      image_2: videoData.image_2 || null,
      image_3: videoData.image_3 || null,
      image_4: videoData.image_4 || null,
      image_5: videoData.image_5 || null,
      image_6: videoData.image_6 || null,
      image_7: videoData.image_7 || null,
      image_8: videoData.image_8 || null,
      image_9: videoData.image_9 || null,
      image_10: videoData.image_10 || null,
      image_11: videoData.image_11 || null,
      image_12: videoData.image_12 || null,
      image_13: videoData.image_13 || null,
      image_14: videoData.image_14 || null,
    };

    // Extract all tags and add them as categories if they don't exist
    const tags = [
      videoData.tag_1,
      videoData.tag_2,
      videoData.tag_3,
      videoData.tag_4,
      videoData.tag_5,
      videoData.tag_6,
      videoData.tag_7,
      videoData.tag_8,
    ].filter(tag => tag && tag.trim() !== '');

    // Add categories for each tag if they don't exist
    for (const tag of tags) {
      const { data: existingCategory } = await supabaseClient
        .from('categories')
        .select('id')
        .eq('name', tag.trim())
        .single();

      if (!existingCategory) {
        await supabaseClient
          .from('categories')
          .insert({ name: tag.trim() });
      }
    }

    // Insert video into database
    const { data, error } = await supabaseClient
      .from('videos')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create video', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Video created successfully', 
        video: data 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});