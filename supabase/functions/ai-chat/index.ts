import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      message, 
      conversationId, 
      userSessionId, 
      userName, 
      userEmail 
    } = await req.json();

    console.log('AI Chat request:', { message, conversationId, userSessionId });

    // Get AI settings
    const { data: aiSettings, error: settingsError } = await supabaseClient
      .from('ai_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !aiSettings) {
      console.error('Failed to get AI settings:', settingsError);
      return new Response(JSON.stringify({ error: 'AI settings not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!aiSettings.widget_enabled) {
      return new Response(JSON.stringify({ error: 'AI widget is disabled' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let currentConversationId = conversationId;

    // Create new conversation if none exists
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabaseClient
        .from('ai_conversations')
        .insert({
          user_session_id: userSessionId,
          user_name: userName,
          user_email: userEmail,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select()
        .single();

      if (convError) {
        console.error('Failed to create conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      currentConversationId = newConversation.id;
    }

    // Save user message
    const { error: userMsgError } = await supabaseClient
      .from('ai_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message
      });

    if (userMsgError) {
      console.error('Failed to save user message:', userMsgError);
    }

    // Get conversation history
    const { data: messages, error: historyError } = await supabaseClient
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true });

    if (historyError) {
      console.error('Failed to get conversation history:', historyError);
    }

    // Prepare messages for VseGPT API
    const apiMessages = [
      { role: 'system', content: aiSettings.system_prompt },
      ...(messages || [])
    ];

    console.log('Sending to VseGPT API:', {
      model: aiSettings.model,
      messagesCount: apiMessages.length
    });

    // Call VseGPT API
    const response = await fetch('https://api.vsegpt.ru/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiSettings.api_key}`,
        'Content-Type': 'application/json',
        'X-Title': 'Kaigo AI Assistant'
      },
      body: JSON.stringify({
        model: aiSettings.model,
        messages: apiMessages,
        temperature: aiSettings.temperature,
        max_tokens: aiSettings.max_tokens,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('VseGPT API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'Failed to get AI response' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('VseGPT API response:', data);

    const aiResponse = data.choices[0].message.content;
    const tokensUsed = data.usage?.total_tokens || 0;

    // Save AI response
    const { error: aiMsgError } = await supabaseClient
      .from('ai_messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiResponse,
        tokens_used: tokensUsed
      });

    if (aiMsgError) {
      console.error('Failed to save AI message:', aiMsgError);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse, 
      conversationId: currentConversationId,
      tokensUsed: tokensUsed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});