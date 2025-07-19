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
  tags?: string[];
  images?: string[];
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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

    // Prepare data for insertion
    const insertData: any = {
      titel: videoData.titel,
      describtion: videoData.describtion || null,
      duration: videoData.duration,
      embed: videoData.embed,
      thumbnail: videoData.thumbnail || null,
    };

    // Handle tags (up to 8)
    if (videoData.tags && Array.isArray(videoData.tags)) {
      const tags = videoData.tags.slice(0, 8);
      tags.forEach((tag, index) => {
        insertData[`tag_${index + 1}`] = tag;
      });
    }

    // Handle images (up to 14)
    if (videoData.images && Array.isArray(videoData.images)) {
      const images = videoData.images.slice(0, 14);
      images.forEach((image, index) => {
        insertData[`image_${index + 1}`] = image;
      });
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