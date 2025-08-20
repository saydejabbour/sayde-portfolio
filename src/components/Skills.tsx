import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Wrench, Globe } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: Code,
      skills: ['Java', 'JavaScript', 'PHP', 'C++', 'HTML', 'CSS', 'Next.js'],
      color: 'from-primary/20 to-accent/20',
    },
    {
      title: 'Tools & Platforms',
      icon: Wrench,
      skills: ['NetBeans', 'MySQL', 'Visual Studio Code', 'Cisco Packet Tracer', 'Supabase'],
      color: 'from-accent/20 to-primary/20',
    },
    {
      title: 'Languages',
      icon: Globe,
      skills: ['English (Fluent)', 'French (Proficient)', 'Arabic (Native)'],
      color: 'from-primary/20 to-accent/30',
    },
  ];

  return (
    <section id="skills" className="py-32 bg-background/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            My{' '}
            <span className="text-primary">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Technologies and tools I work with to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-500 hover:-translate-y-3 group">
              <CardHeader className="text-center pb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex} 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-200 px-3 py-1 text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;