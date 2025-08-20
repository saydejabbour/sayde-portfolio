import { Button } from '@/components/ui/button';
import { Download, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const { data: profile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <section id="hero" className="min-h-screen flex items-center bg-[var(--gradient-hero)] pt-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-primary font-medium text-lg tracking-wide">Hello.</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  I'm{' '}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {profile?.name || 'Sayde Jabbour'}
                  </span>
                </h1>
              </div>
              <h2 className="text-2xl md:text-3xl text-foreground font-bold">
                {profile?.role_title || 'Computer Science Student & Developer'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                {profile?.bio || 'Building secure, scalable, and user-friendly applications with a focus on innovation and clean design.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium shadow-[var(--shadow-royal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                Get a project
              </Button>
              {profile?.resume_file && (
                <>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-muted-foreground/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-8 py-4 text-lg font-medium transition-all duration-300"
                  >
                    <a 
                      href={supabase.storage.from('assets').getPublicUrl(profile.resume_file).data.publicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-muted-foreground/20 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-8 py-4 text-lg font-medium transition-all duration-300"
                  >
                    <a 
                      href={supabase.storage.from('assets').getPublicUrl(profile.resume_file).data.publicUrl} 
                      download="Sayde_Jabbour_CV.pdf"
                    >
                      Download CV
                    </a>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              <div className="absolute -inset-4 rounded-full border-2 border-primary/10"></div>
              
              {/* Profile image container */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 p-1 shadow-[var(--shadow-royal)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-card">
                    {profile?.profile_picture ? (
                      <img
                        src={supabase.storage.from('assets').getPublicUrl(profile.profile_picture).data.publicUrl}
                        alt={profile?.name || 'Profile picture'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/30 flex items-center justify-center">
                        <span className="text-8xl font-bold text-muted-foreground">
                          {(profile?.name || 'Admin').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Glowing effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl -z-10 opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;