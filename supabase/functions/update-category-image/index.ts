import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { categoryName, imageUrl } = await req.json()

    if (!categoryName || !imageUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'categoryName and imageUrl are required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log(`Updating category ${categoryName} with image URL: ${imageUrl}`)

    // Check if category exists
    const { data: existingCategory, error: selectError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', categoryName)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking category:', selectError)
      throw selectError
    }

    if (existingCategory) {
      // Update existing category
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: imageUrl })
        .eq('name', categoryName)

      if (updateError) {
        console.error('Error updating category:', updateError)
        throw updateError
      }

      console.log(`Successfully updated existing category: ${categoryName}`)
    } else {
      // Create new category
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: categoryName,
          image_url: imageUrl
        })

      if (insertError) {
        console.error('Error creating category:', insertError)
        throw insertError
      }

      console.log(`Successfully created new category: ${categoryName}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: existingCategory 
          ? `Updated image for category: ${categoryName}`
          : `Created new category: ${categoryName}`,
        categoryName,
        imageUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in update-category-image function:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})