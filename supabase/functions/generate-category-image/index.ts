import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateImageRequest {
  positivePrompt: string;
  categoryName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')
    if (!RUNWARE_API_KEY) {
      console.error('RUNWARE_API_KEY is not set')
      return new Response(
        JSON.stringify({ error: 'RUNWARE_API_KEY is not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { positivePrompt, categoryName }: GenerateImageRequest = await req.json()

    if (!positivePrompt || !categoryName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: positivePrompt and categoryName' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log(`Checking if image already exists for category: ${categoryName}`)

    // Prüfe ob bereits ein Bild für diese Kategorie existiert
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('image_url')
      .eq('name', categoryName)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing category:', checkError)
    }

    if (existingCategory?.image_url) {
      console.log(`Image already exists for category ${categoryName}: ${existingCategory.image_url}`)
      return new Response(
        JSON.stringify({ 
          success: true,
          imageUrl: existingCategory.image_url,
          categoryName,
          message: 'Image already exists',
          cost: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Generating new image for category: ${categoryName}`)

    // Create the enhanced prompt for category images
    const enhancedPrompt = `${positivePrompt}, professional category icon, clean design, high quality`

    const requestBody = [
      {
        "taskType": "authentication",
        "apiKey": RUNWARE_API_KEY
      },
      {
        "taskType": "imageInference",
        "model": "runware:101@1",
        "numberResults": 1,
        "outputFormat": "JPEG",
        "width": 1024,
        "height": 1024,
        "steps": 28,
        "CFGScale": 3.5,
        "scheduler": "FlowMatchEulerDiscreteScheduler",
        "includeCost": true,
        "outputType": ["URL"],
        "lora": [
          {
            "model": "civitai:667086@746602",
            "weight": 1
          }
        ],
        "positivePrompt": enhancedPrompt
      }
    ]

    console.log('Sending request to Runware API...')

    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Runware API error response:', errorText)
      throw new Error(`Runware API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Runware API response:', JSON.stringify(result, null, 2))

    // Find the image inference result
    const imageResult = result.data?.find((item: any) => item.taskType === 'imageInference')
    
    if (!imageResult || !imageResult.imageURL) {
      console.error('No image generated or invalid response:', result)
      throw new Error('No image generated or invalid response from Runware')
    }

    console.log(`Image generated successfully: ${imageResult.imageURL}`)

    // Speichere das generierte Bild in der Datenbank
    const { error: upsertError } = await supabase
      .from('categories')
      .upsert({
        name: categoryName,
        image_url: imageResult.imageURL,
        description: `Auto-generated image for ${categoryName} category`
      }, {
        onConflict: 'name'
      })

    if (upsertError) {
      console.error('Error saving category to database:', upsertError)
      // Trotzdem das Bild zurückgeben, auch wenn Speichern fehlschlägt
    } else {
      console.log(`Category ${categoryName} saved to database successfully`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: imageResult.imageURL,
        categoryName,
        cost: imageResult.cost || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in generate-category-image function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate category image',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})