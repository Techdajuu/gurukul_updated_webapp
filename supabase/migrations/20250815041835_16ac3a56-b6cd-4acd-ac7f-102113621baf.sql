-- Fix the create_admin_user function search path
CREATE OR REPLACE FUNCTION public.create_admin_user(admin_email text, admin_password text, admin_name text DEFAULT 'System Administrator'::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_user_id UUID;
BEGIN
  -- Insert user into auth.users (this is a simplified approach)
  -- In production, users should sign up through the normal auth flow
  
  -- For now, let's just create a profile ready for an admin user
  -- The actual auth user needs to be created through Supabase Auth
  
  RETURN 'Admin user profile structure ready. Please create auth user through signup and then update role to admin.';
END;
$function$;