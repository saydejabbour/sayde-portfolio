-- Add role column to profile table
ALTER TABLE public.profile 
ADD COLUMN role text DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer'));