import { Button } from '@/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    if (profile?.resume_file) {
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(profile.resume_file);
      window.open(data.publicUrl, '_blank');
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center bg-gradient-to-b from-background to-muted/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Hello, I'm{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {profile?.name || 'Sayde Jabbour'}
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
                {profile?.role_title || 'Computer Science Student & Developer'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Building secure, scalable, and user-friendly applications.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[var(--shadow-royal)]"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get a project?
              </Button>
              <Button
                onClick={handleResumeDownload}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="mr-2 h-5 w-5" />
                My Resume
              </Button>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-card shadow-[var(--shadow-card)]">
                  {profile?.profile_picture ? (
                    <img
                      src={supabase.storage.from('assets').getPublicUrl(profile.profile_picture).data.publicUrl}
                      alt={profile.name || 'Sayde Jabbour'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-6xl font-bold text-muted-foreground">
                        {(profile?.name || 'SJ').charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;