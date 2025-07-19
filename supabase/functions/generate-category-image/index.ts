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
    
    console.log('=== Starting image generation ===')
    console.log('API Key exists:', !!RUNWARE_API_KEY)
    
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

    const body = await req.json()
    console.log('Received request body:', JSON.stringify(body, null, 2))
    
    const { positivePrompt, categoryName }: GenerateImageRequest = body

    if (!positivePrompt || !categoryName) {
      console.error('Missing required fields:', { positivePrompt: !!positivePrompt, categoryName: !!categoryName })
      return new Response(
        JSON.stringify({ error: 'Missing required fields: positivePrompt and categoryName' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log(`Processing category: ${categoryName}`)

    // Prüfe ob bereits ein Bild für diese Kategorie existiert
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('image_url')
      .eq('name', categoryName)
      .maybeSingle()

    if (checkError) {
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

    // Vereinfachte Runware API Anfrage ohne LoRA
    const requestBody = [
      {
        "taskType": "authentication",
        "apiKey": RUNWARE_API_KEY
      },
      {
        "taskType": "imageInference",
        "model": "runware:100@1", // Einfacheres Model
        "numberResults": 1,
        "outputFormat": "JPEG",
        "width": 512,
        "height": 512,
        "steps": 4,
        "CFGScale": 1,
        "scheduler": "FlowMatchEulerDiscreteScheduler",
        "includeCost": true,
        "outputType": ["URL"],
        "positivePrompt": `${positivePrompt}, icon, simple, clean background`
      }
    ]

    console.log('Sending simplified request to Runware API...')
    console.log('Request payload:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Runware API response status:', response.status)
    console.log('Runware API response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Runware API error response:', errorText)
      return new Response(
        JSON.stringify({ 
          error: `Runware API error: ${response.status}`,
          details: errorText
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    const result = await response.json()
    console.log('Runware API success response:', JSON.stringify(result, null, 2))

    // Find the image inference result
    const imageResult = result.data?.find((item: any) => item.taskType === 'imageInference')
    
    if (!imageResult || !imageResult.imageURL) {
      console.error('No image generated or invalid response:', result)
      return new Response(
        JSON.stringify({ 
          error: 'No image generated or invalid response from Runware',
          details: JSON.stringify(result)
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
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
    console.error('=== ERROR IN FUNCTION ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate category image',
        details: error.message,
        type: error.constructor.name
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})