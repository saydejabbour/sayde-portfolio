-- Update the trigger function to use the correct table name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if there are any admin users
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE role = 'admin') INTO admin_exists;
  
  -- Insert new profile, set as admin if no admin exists, otherwise viewer
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, CASE WHEN admin_exists THEN 'viewer' ELSE 'admin' END);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;