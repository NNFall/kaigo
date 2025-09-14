-- Включаем расширение для шифрования паролей
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Исправляем функцию create_admin_user
CREATE OR REPLACE FUNCTION public.create_admin_user(
  admin_email text,
  admin_password text,
  admin_full_name text DEFAULT 'Admin'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- Создаем пользователя в auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    json_build_object('full_name', admin_full_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;

  -- Добавляем в profiles
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new_user_id, admin_email, admin_full_name);
  
  -- Добавляем роль админа
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');
  
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', admin_email,
    'message', 'Admin user created successfully'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    result := json_build_object(
      'success', false,
      'error', SQLERRM
    );
    RETURN result;
END;
$$;