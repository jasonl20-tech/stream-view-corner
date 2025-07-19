import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Starting migration of video tags to categories...');

    // Get all videos with their tags
    const { data: videos, error: videosError } = await supabaseClient
      .from('videos')
      .select('id, tag_1, tag_2, tag_3, tag_4, tag_5, tag_6, tag_7, tag_8');

    if (videosError) {
      console.error('Error fetching videos:', videosError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch videos', details: videosError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Collect all unique tags
    const allTags = new Set<string>();
    
    videos?.forEach(video => {
      const tags = [
        video.tag_1,
        video.tag_2,
        video.tag_3,
        video.tag_4,
        video.tag_5,
        video.tag_6,
        video.tag_7,
        video.tag_8,
      ].filter(tag => tag && tag.trim() !== '');
      
      tags.forEach(tag => allTags.add(tag.trim()));
    });

    console.log(`Found ${allTags.size} unique tags:`, Array.from(allTags));

    // Get existing categories
    const { data: existingCategories, error: categoriesError } = await supabaseClient
      .from('categories')
      .select('name');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch categories', details: categoriesError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const existingCategoryNames = new Set(existingCategories?.map(cat => cat.name) || []);
    console.log(`Found ${existingCategoryNames.size} existing categories:`, Array.from(existingCategoryNames));

    // Find new categories to create
    const newCategories = Array.from(allTags).filter(tag => !existingCategoryNames.has(tag));
    console.log(`Creating ${newCategories.length} new categories:`, newCategories);

    let createdCount = 0;
    let errorCount = 0;

    // Create new categories
    for (const categoryName of newCategories) {
      const { error } = await supabaseClient
        .from('categories')
        .insert({ name: categoryName });

      if (error) {
        console.error(`Error creating category "${categoryName}":`, error);
        errorCount++;
      } else {
        console.log(`Created category: ${categoryName}`);
        createdCount++;
      }
    }

    const summary = {
      totalVideos: videos?.length || 0,
      uniqueTags: allTags.size,
      existingCategories: existingCategoryNames.size,
      newCategoriesCreated: createdCount,
      errors: errorCount,
      categoriesCreated: newCategories
    };

    console.log('Migration completed:', summary);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Migration completed successfully',
        summary
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});