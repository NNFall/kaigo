import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log('Received audio data for transcription, size:', audio.length);

    // Get AI settings from database
    const { data: aiSettings, error: settingsError } = await supabase
      .from('ai_settings')
      .select('*')
      .limit(1)
      .single()

    if (settingsError) {
      console.error('Failed to fetch AI settings:', settingsError);
      throw new Error('Failed to fetch AI settings')
    }

    if (!aiSettings?.api_key) {
      throw new Error('API key not configured')
    }

    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio)
    console.log('Processed binary audio, size:', binaryAudio.length);
    
    // Prepare form data
    const formData = new FormData()
    const blob = new Blob([binaryAudio], { type: 'audio/webm' })
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-1')
    formData.append('language', 'ru') // Set Russian as preferred language

    console.log('Sending to VseGPT Whisper API...');

    // Send to VseGPT
    const response = await fetch('https://api.vsegpt.ru/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiSettings.api_key}`,
        'X-Title': 'VoiceToText',
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VseGPT API error:', response.status, errorText);
      throw new Error(`VseGPT API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Transcription result:', result);

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in VseGPT voice-to-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})