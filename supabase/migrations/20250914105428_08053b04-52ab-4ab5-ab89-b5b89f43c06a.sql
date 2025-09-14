-- Update user role to admin for nikitanovyj1@gmail.com
-- First, find the user by email and update their role to admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'nikitanovyj1@gmail.com'
);

-- If no role exists, insert one
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'nikitanovyj1@gmail.com'
AND id NOT IN (SELECT user_id FROM public.user_roles);

-- Update profile if it exists
UPDATE public.profiles 
SET full_name = 'Никита'
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'nikitanovyj1@gmail.com'
);

-- Insert profile if it doesn't exist
INSERT INTO public.profiles (user_id, email, full_name)
SELECT id, email, 'Никита'
FROM auth.users 
WHERE email = 'nikitanovyj1@gmail.com'
AND id NOT IN (SELECT user_id FROM public.profiles);