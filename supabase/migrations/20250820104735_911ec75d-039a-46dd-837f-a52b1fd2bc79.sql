-- Drop all existing policies first
DROP POLICY IF EXISTS "Admin can manage profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can manage contact" ON public.contact;
DROP POLICY IF EXISTS "Public can view contact" ON public.contact;

-- Create safe RLS policies for profiles (no self-reference)
CREATE POLICY "Public can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for projects table (referencing profiles is OK)
CREATE POLICY "Public can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage projects" 
ON public.projects 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create policies for contact table (referencing profiles is OK)
CREATE POLICY "Public can view contact" 
ON public.contact 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage contact" 
ON public.contact 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);