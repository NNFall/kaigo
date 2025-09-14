-- Fix critical security issues in AI conversation system

-- 1. Fix ai_conversations RLS policies - restrict updates to conversation owners only
DROP POLICY IF EXISTS "Anyone can update their conversation" ON public.ai_conversations;

CREATE POLICY "Users can update their own conversations" 
ON public.ai_conversations 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND user_session_id = user_session_id);

-- 2. Add proper RLS policy for users to read their own conversation messages
CREATE POLICY "Users can view their own conversation messages" 
ON public.ai_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.ai_conversations 
    WHERE ai_conversations.id = ai_messages.conversation_id 
    AND ai_conversations.user_session_id = ai_conversations.user_session_id
  )
);

-- 3. Add user_id column to ai_conversations for proper authentication
ALTER TABLE public.ai_conversations 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 4. Update RLS policies to use user_id for proper authentication
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.ai_conversations;

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

-- 5. Update ai_messages policies to check conversation ownership
DROP POLICY IF EXISTS "Users can view their own conversation messages" ON public.ai_messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON public.ai_messages;

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

-- 6. Add audit logging table for admin actions
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