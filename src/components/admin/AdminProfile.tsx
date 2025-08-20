import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Save, Loader2, User, FileText } from 'lucide-react';

const AdminProfile = () => {
  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const profilePictureRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setRoleTitle(profile.role_title || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      let profilePictureUrl = profile?.profile_picture;
      let resumeFileUrl = profile?.resume_file;

      // Upload profile picture if selected
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `profile-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, profilePicture, { upsert: true });

        if (uploadError) throw uploadError;
        profilePictureUrl = fileName;
      }

      // Upload resume if selected
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `resume-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(fileName, resumeFile, { upsert: true });

        if (uploadError) throw uploadError;
        resumeFileUrl = fileName;
      }

      // Update profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          role_title: roleTitle,
          bio,
          profile_picture: profilePictureUrl,
          resume_file: resumeFileUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setProfilePicture(null);
      setResumeFile(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and bio that appears on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleTitle">Role Title</Label>
              <Input
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g., Computer Science Student & Developer"
                className="border-primary/20 focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell visitors about yourself..."
              rows={4}
              className="border-primary/20 focus:border-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a professional photo for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.profile_picture && (
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto">
                <img
                  src={supabase.storage.from('assets').getPublicUrl(profile.profile_picture).data.publicUrl}
                  alt="Current profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <input
                type="file"
                ref={profilePictureRef}
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => profilePictureRef.current?.click()}
                className="w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" />
                {profilePicture ? 'Change Picture' : 'Upload Picture'}
              </Button>
              {profilePicture && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {profilePicture.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Resume File
            </CardTitle>
            <CardDescription>
              Upload your resume for the download button
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile?.resume_file && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Current file: {profile.resume_file.split('/').pop()}
                </p>
              </div>
            )}
            <div>
              <input
                type="file"
                ref={resumeRef}
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => resumeRef.current?.click()}
                className="w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Upload className="mr-2 h-4 w-4" />
                {resumeFile ? 'Change Resume' : 'Upload Resume'}
              </Button>
              {resumeFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {resumeFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-[var(--shadow-card)]">
        <CardContent className="pt-6">
          <Button
            onClick={() => updateProfile.mutate()}
            disabled={updateProfile.isPending}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;