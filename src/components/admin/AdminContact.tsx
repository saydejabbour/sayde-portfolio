import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Loader2, MessageSquare } from 'lucide-react';

const AdminContact = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const queryClient = useQueryClient();

  const { data: contact, isLoading } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (contact) {
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setLocation(contact.location || '');
      setGithub(contact.github || '');
    }
  }, [contact]);

  const updateContact = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('contact')
        .update({
          phone,
          email,
          location,
          github,
        })
        .eq('id', contact?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Contact updated',
        description: 'Your contact information has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-contact'] });
      queryClient.invalidateQueries({ queryKey: ['contact'] });
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
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)]">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5 text-primary" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Update your contact details displayed on your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+961 81 336 237"
              className="border-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="border-primary/20 focus:border-primary"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="border-primary/20 focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username"
              className="border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <Button
          onClick={() => updateContact.mutate()}
          disabled={updateContact.isPending}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        >
          {updateContact.isPending ? (
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
  );
};

export default AdminContact;