import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
      throw new Error('RUNWARE_API_KEY is not set')
    }

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

    // Create the enhanced prompt for category images
    const enhancedPrompt = `${positivePrompt}, high quality, professional, clean background, category icon style, modern design`

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

    console.log('Sending request to Runware:', JSON.stringify(requestBody, null, 2))

    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Runware API error:', errorText)
      throw new Error(`Runware API error: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    console.log('Runware response:', JSON.stringify(result, null, 2))

    // Find the image inference result
    const imageResult = result.data?.find((item: any) => item.taskType === 'imageInference')
    
    if (!imageResult || !imageResult.imageURL) {
      throw new Error('No image generated or invalid response from Runware')
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
    console.error('Error generating category image:', error)
    
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