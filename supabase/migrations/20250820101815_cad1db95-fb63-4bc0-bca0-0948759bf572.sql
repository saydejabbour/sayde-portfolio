-- Create public storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  role_title text,
  bio text,
  resume_file text,
  profile_picture text,
  role text DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create projects table  
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  technologies text[],
  image text,
  link text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create contact table
CREATE TABLE public.contact (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text,
  email text,
  location text,
  github text,
  social_links jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for projects
CREATE POLICY "Public can view projects" 
ON public.projects FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage projects" 
ON public.projects FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- RLS Policies for contact
CREATE POLICY "Public can view contact" 
ON public.contact FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage contact" 
ON public.contact FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Storage policies for assets bucket
CREATE POLICY "Public can view assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'assets');

CREATE POLICY "Admin can upload assets" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can update assets" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "Admin can delete assets" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if any admin already exists
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE role = 'admin') INTO admin_exists;
  
  -- Insert new profile
  INSERT INTO public.profiles (id, role)
  VALUES (
    NEW.id, 
    CASE 
      WHEN admin_exists THEN 'viewer'
      ELSE 'admin'
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_updated_at
  BEFORE UPDATE ON public.contact
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();