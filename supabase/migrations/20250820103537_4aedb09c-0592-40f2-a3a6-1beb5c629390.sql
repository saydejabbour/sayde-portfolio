-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if there are any admin users
  SELECT EXISTS(SELECT 1 FROM public.profile WHERE role = 'admin') INTO admin_exists;
  
  -- Insert new profile, set as admin if no admin exists, otherwise viewer
  INSERT INTO public.profile (id, role)
  VALUES (NEW.id, CASE WHEN admin_exists THEN 'viewer' ELSE 'admin' END);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();