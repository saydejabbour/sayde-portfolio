-- Fix RLS policies to reference the correct profile table

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage profile" ON public.profile;
DROP POLICY IF EXISTS "Admin can manage assets" ON storage.objects;

-- Create correct policies that reference the profile table
CREATE POLICY "Admin can manage profile" 
ON public.profile 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profile 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin can manage assets" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'assets' AND 
  EXISTS (
    SELECT 1 FROM public.profile 
    WHERE id = auth.uid() AND role = 'admin'
  )
);