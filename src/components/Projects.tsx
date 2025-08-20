import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Database, Globe, Shield, Cpu } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Projects = () => {
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getProjectIcon = (title: string) => {
    if (title.toLowerCase().includes('database')) return Database;
    if (title.toLowerCase().includes('website') || title.toLowerCase().includes('platform')) return Globe;
    if (title.toLowerCase().includes('security') || title.toLowerCase().includes('cyber')) return Shield;
    if (title.toLowerCase().includes('robotics') || title.toLowerCase().includes('glasses')) return Cpu;
    return Database;
  };

  return (
    <section id="projects" className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A showcase of my academic and personal projects demonstrating various skills and technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const IconComponent = getProjectIcon(project.title);
            return (
              <Card key={project.id} className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={supabase.storage.from('assets').getPublicUrl(project.image).data.publicUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                    {project.link && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(project.link, '_blank')}
                        className="hover:bg-primary/10 text-primary"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors duration-300 mb-3">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, techIndex) => (
                      <Badge 
                        key={techIndex} 
                        variant="outline"
                        className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;