-- 1. Rename profile table to profiles (if not already done)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile' AND table_schema = 'public') THEN
        ALTER TABLE public.profile RENAME TO profiles;
    END IF;
END $$;

-- 2. Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Admin can manage profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can manage contact" ON public.contact;
DROP POLICY IF EXISTS "Public can view contact" ON public.contact;
DROP POLICY IF EXISTS "Admin can manage assets" ON storage.objects;
DROP POLICY IF EXISTS "Public can view assets" ON storage.objects;

-- 3. Create safe RLS policies for profiles (no self-reference)
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

-- 4. Create admin policies for other tables (referencing profiles is OK)
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

-- 5. Update storage policies to use profiles table
CREATE POLICY "Public can view assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assets');

CREATE POLICY "Admin can manage assets" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);