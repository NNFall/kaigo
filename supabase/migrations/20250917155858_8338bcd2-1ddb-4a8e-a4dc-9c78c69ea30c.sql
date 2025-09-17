-- Fix critical security issues in AI conversation system (corrected)

-- 1. Add user_id column to ai_conversations for proper authentication
ALTER TABLE public.ai_conversations 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can update their conversation" ON public.ai_conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Anyone can create messages" ON public.ai_messages;

-- 3. Create secure RLS policies for ai_conversations
CREATE POLICY "Authenticated users can create conversations" 
ON public.ai_conversations 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations" 
ON public.ai_conversations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversations" 
ON public.ai_conversations 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Create secure RLS policies for ai_messages
CREATE POLICY "Authenticated users can create messages" 
ON public.ai_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE ai_conversations.id = ai_messages.conversation_id 
    AND ai_conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own conversation messages" 
ON public.ai_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE ai_conversations.id = ai_messages.conversation_id 
    AND ai_conversations.user_id = auth.uid()
  )
);

-- 5. Add audit logging table for admin actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can create audit logs
CREATE POLICY "Only admins can create audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));