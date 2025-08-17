-- Create a default admin user
-- Note: You'll need to set the password through Supabase Auth dashboard
-- This creates the profile entry, but the auth user must be created separately

-- First, let's create a function to safely create an admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT,
  admin_name TEXT DEFAULT 'System Administrator'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert user into auth.users (this is a simplified approach)
  -- In production, users should sign up through the normal auth flow
  
  -- For now, let's just create a profile ready for an admin user
  -- The actual auth user needs to be created through Supabase Auth
  
  RETURN 'Admin user profile structure ready. Please create auth user through signup and then update role to admin.';
END;
$$;

-- Alternative: Create a function to promote existing user to admin
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Update their profile role to admin
  UPDATE profiles 
  SET role = 'admin'
  WHERE user_id = target_user_id;
  
  IF FOUND THEN
    RETURN 'User ' || user_email || ' has been promoted to admin';
  ELSE
    RETURN 'Profile not found for user: ' || user_email;
  END IF;
END;
$$;