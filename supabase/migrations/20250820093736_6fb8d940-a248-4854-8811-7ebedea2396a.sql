-- Create users table for authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profile table for personal information
CREATE TABLE public.profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  role_title TEXT,
  bio TEXT,
  resume_file TEXT,
  profile_picture TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  technologies TEXT[],
  image TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact table
CREATE TABLE public.contact (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT,
  email TEXT,
  location TEXT,
  github TEXT,
  social_links JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- RLS Policies for public read access to profile, projects, contact
CREATE POLICY "Public can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view contact" ON public.contact FOR SELECT USING (true);

-- RLS Policies for admin access
CREATE POLICY "Admin can manage profile" ON public.profile 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Admin can manage projects" ON public.projects 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Admin can manage contact" ON public.contact 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Admin can view their own user record (without password hash in policies)
CREATE POLICY "Admin can view own user" ON public.users 
FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can update own user" ON public.users 
FOR UPDATE USING (id = auth.uid());

-- Storage policies for assets bucket
CREATE POLICY "Public can view assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Admin can manage assets" ON storage.objects 
FOR ALL USING (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_updated_at
  BEFORE UPDATE ON public.contact
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial admin user (password: TempPass123!)
INSERT INTO public.users (email, password_hash, role) VALUES 
('sayde.jabbour04@hotmail.com', '$2b$12$LQv3c1yqBWVHxkd0LQ4YCOdaFwKzlpX5JBtN6XMSAJcA9SXj1yZ2W', 'admin');

-- Insert initial profile data
INSERT INTO public.profile (name, role_title, bio) VALUES 
('Sayde Jabbour', 'Computer Science Student & Developer', 'I''m a computer science student at LIU (GPA 3.77) with experience in web development, databases, and robotics. I enjoy building real-world projects that combine functionality with design. My work spans from cybersecurity websites to assistive wearable devices, with a strong focus on reliability and creativity.');

-- Insert initial contact data
INSERT INTO public.contact (phone, email, location, github) VALUES 
('+961 81 336 237', 'sayde.jabbour04@hotmail.com', 'Koura, Lebanon', 'https://github.com/saydejabbour');

-- Insert initial projects
INSERT INTO public.projects (title, description, technologies) VALUES 
('Al-Arz Music Records – Database System', 'Built a normalized music DB with advanced queries. Modeled relationships between songs, musicians, instruments, albums.', ARRAY['MySQL', 'SQL', 'ERD']),
('Online Learning Platform – Software Project', 'Planned responsive e‑learning with dashboards & progress tracking. Designed UI/UX and outlined backend.', ARRAY['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Bootstrap']),
('SoSecure – Cyber Awareness Website', 'Security awareness site with safe‑browsing tips. PHP & MySQL for secure forms and dynamic content.', ARRAY['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL']),
('Smart Assistive Glasses – Robotics Project', 'Detects obstacles and alerts via buzzer. Sends GPS location to caregiver on help button press.', ARRAY['Arduino UNO', 'Ultrasonic', 'GPS', 'Bluetooth']);