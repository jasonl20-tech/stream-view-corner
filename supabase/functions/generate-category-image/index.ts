import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== DEBUG: Function started ===')
    
    // Prüfe Environment Variables
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY')
    console.log('RUNWARE_API_KEY exists:', !!RUNWARE_API_KEY)
    console.log('RUNWARE_API_KEY length:', RUNWARE_API_KEY?.length || 0)
    
    if (!RUNWARE_API_KEY) {
      console.error('RUNWARE_API_KEY is missing')
      return new Response(
        JSON.stringify({ 
          error: 'API Key not configured',
          debug: 'RUNWARE_API_KEY environment variable is not set'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Parse request body
    let body
    try {
      body = await req.json()
      console.log('Request body parsed successfully:', body)
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          debug: parseError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const { positivePrompt, categoryName } = body

    if (!positivePrompt || !categoryName) {
      console.error('Missing fields:', { positivePrompt, categoryName })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          debug: `positivePrompt: ${positivePrompt}, categoryName: ${categoryName}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log(`Processing category: "${categoryName}" with prompt: "${positivePrompt}"`)

    // Teste einfache Runware API Anfrage
    const testPayload = [
      {
        "taskType": "authentication",
        "apiKey": RUNWARE_API_KEY
      }
    ]

    console.log('Testing Runware authentication...')
    
    let runwareResponse
    try {
      runwareResponse = await fetch('https://api.runware.ai/v1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      })
      
      console.log('Runware auth response status:', runwareResponse.status)
      console.log('Runware auth response ok:', runwareResponse.ok)
      
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to connect to Runware API',
          debug: fetchError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    let authResult
    try {
      authResult = await runwareResponse.json()
      console.log('Runware auth result:', JSON.stringify(authResult, null, 2))
    } catch (jsonError) {
      console.error('Error parsing Runware response:', jsonError)
      const textResponse = await runwareResponse.text()
      console.log('Raw response:', textResponse)
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid response from Runware API',
          debug: textResponse
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Prüfe Authentication Result
    if (authResult.error || authResult.errors) {
      console.error('Runware authentication failed:', authResult)
      return new Response(
        JSON.stringify({ 
          error: 'Runware authentication failed',
          debug: authResult
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    // Für jetzt geben wir einen Erfolg zurück ohne Bildgenerierung
    console.log('Authentication successful, returning test response')
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test successful - authentication works',
        categoryName,
        debug: {
          authResponse: authResult,
          apiKeyLength: RUNWARE_API_KEY.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('=== CRITICAL ERROR ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Error cause:', error.cause)
    
    return new Response(
      JSON.stringify({ 
        error: 'Critical function error',
        debug: {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 5).join('\n')
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})