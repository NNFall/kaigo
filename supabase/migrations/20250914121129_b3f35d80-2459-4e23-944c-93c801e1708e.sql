-- Create AI settings table
CREATE TABLE public.ai_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'openai/gpt-4o-mini',
  system_prompt TEXT NOT NULL DEFAULT 'Вы полезный AI-ассистент, готовый помочь пользователям с их вопросами.',
  widget_enabled BOOLEAN NOT NULL DEFAULT true,
  max_tokens INTEGER NOT NULL DEFAULT 3000,
  temperature DECIMAL NOT NULL DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_session_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI messages table
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- AI Settings policies (only admins)
CREATE POLICY "Only admins can view AI settings" 
ON public.ai_settings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update AI settings" 
ON public.ai_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert AI settings" 
ON public.ai_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- AI Conversations policies
CREATE POLICY "Admins can view all conversations" 
ON public.ai_conversations 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create conversations" 
ON public.ai_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update their conversation" 
ON public.ai_conversations 
FOR UPDATE 
USING (true);

-- AI Messages policies
CREATE POLICY "Admins can view all messages" 
ON public.ai_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can create messages" 
ON public.ai_messages 
FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_ai_settings_updated_at
BEFORE UPDATE ON public.ai_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ai_conversations_session_id ON public.ai_conversations(user_session_id);
CREATE INDEX idx_ai_conversations_created_at ON public.ai_conversations(created_at);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON public.ai_messages(created_at);

-- Insert default AI settings
INSERT INTO public.ai_settings (api_key, model, system_prompt) 
VALUES ('your-vsegpt-api-key', 'openai/gpt-4o-mini', 'Вы полезный AI-ассистент, готовый помочь пользователям с их вопросами. Отвечайте вежливо и информативно на русском языке.');