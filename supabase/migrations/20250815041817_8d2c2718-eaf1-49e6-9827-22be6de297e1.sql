-- Fix search path for remaining functions

-- Update get_current_user_role function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$function$;

-- Update promote_user_to_admin function  
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;