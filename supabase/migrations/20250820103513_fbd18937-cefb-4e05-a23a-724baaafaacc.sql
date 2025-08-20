-- Create profile for the first user and set as admin
INSERT INTO public.profile (id, role) 
VALUES ('2756e825-9b81-46c4-8bde-0d5a1fb3dff9', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';