-- 1. Rename profile table to profiles
ALTER TABLE public.profile RENAME TO profiles;

-- 2. Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Admin can manage profile" ON public.profiles;
DROP POLICY IF EXISTS "Public can view profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can manage contact" ON public.contact;

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