import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Trophy, Star, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
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

  const stats = [
    {
      icon: GraduationCap,
      label: '4+ Academic Projects',
      description: 'Completed projects',
    },
    {
      icon: Briefcase,
      label: 'First Internship Experience',
      description: 'Professional growth',
    },
    {
      icon: Star,
      label: 'Strong GPA: 3.77',
      description: 'Academic excellence',
    },
    {
      icon: Trophy,
      label: 'Innovation Focus',
      description: 'Creative solutions',
    },
  ];

  return (
    <section id="about" className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About{' '}
            <span className="text-primary">me</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Bio Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {profile?.bio || `I'm a computer science student at LIU (GPA 3.77) with experience in web development, databases, and robotics. I enjoy building real-world projects that combine functionality with design. My work spans from cybersecurity websites to assistive wearable devices, with a strong focus on reliability and creativity.`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Education</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Computer Science at LIU</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">GPA: 3.77</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Expected Graduation: July 2026</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Expertise</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Web Development</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Database Design</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">Robotics & IoT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground">Achievements</h3>
            <div className="space-y-6">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-card/50 rounded-lg border border-border/10 hover:bg-card transition-colors duration-300">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg">{stat.label}</h4>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;