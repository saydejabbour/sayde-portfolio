-- Drop all existing policies one by one and recreate them properly
DROP POLICY "Admin can manage profile" ON public.profiles;
DROP POLICY "Public can view profile" ON public.profiles;

-- Create correct policies for profiles (no recursion)
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