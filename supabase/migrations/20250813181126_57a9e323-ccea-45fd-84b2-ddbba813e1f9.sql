-- Let's create the admin account directly in the auth system
-- First, create a secure way to insert an admin user

-- Create admin user with email and promote to admin role
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@gurukul.com',
  crypt('admin123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
);

-- Get the user ID we just created and create profile
INSERT INTO public.profiles (
  user_id,
  full_name,
  role
) 
SELECT 
  id,
  'System Administrator',
  'admin'::user_role
FROM auth.users 
WHERE email = 'admin@gurukul.com';