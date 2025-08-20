import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Trophy, Star, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const About = () => {
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
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my background, skills, and passion for technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bio Section */}
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {profile?.bio || `I'm a computer science student at LIU (GPA 3.77) with experience in web development, databases, and robotics. I enjoy building real-world projects that combine functionality with design. My work spans from cybersecurity websites to assistive wearable devices, with a strong focus on reliability and creativity.`}
              </p>
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Key Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Computer Science Student at LIU</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Full-stack web development experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Database design and optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-muted-foreground">Robotics and IoT projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{stat.label}</h4>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;