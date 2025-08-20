import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Github, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { data: contact } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  });

  const contactMethods = [
    {
      icon: Phone,
      label: 'Phone',
      value: contact?.phone || '+961 81 336 237',
      href: `tel:${contact?.phone || '+961 81 336 237'}`,
      color: 'from-green-500/20 to-green-600/20',
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact?.email || 'sayde.jabbour04@hotmail.com',
      href: `mailto:${contact?.email || 'sayde.jabbour04@hotmail.com'}`,
      color: 'from-blue-500/20 to-blue-600/20',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contact?.location || 'Koura, Lebanon',
      href: '#',
      color: 'from-red-500/20 to-red-600/20',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'saydejabbour',
      href: contact?.github || 'https://github.com/saydejabbour',
      color: 'from-gray-500/20 to-gray-600/20',
    },
  ];

  return (
    <section id="contact" className="py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get in{' '}
            <span className="text-primary">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Ready to collaborate on your next project? Let's connect and discuss how we can work together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-500 hover:-translate-y-2 group">
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{method.label}</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm text-muted-foreground mb-4 break-all">
                  {method.value}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (method.href !== '#') {
                      window.open(method.href, '_blank');
                    }
                  }}
                  className="border-primary/30 text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground group-hover:shadow-md transition-all duration-200"
                  disabled={method.href === '#'}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-0 bg-card/30 backdrop-blur-sm shadow-[var(--shadow-card)]">
            <CardContent className="p-12">
              <h3 className="text-3xl font-bold mb-4 text-foreground">Ready to Start Your Project?</h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Whether you need a web application, database solution, or custom software development, 
                I'm here to help bring your ideas to life with clean, efficient, and scalable code.
              </p>
              <Button
                size="lg"
                onClick={() => window.open(`mailto:${contact?.email || 'sayde.jabbour04@hotmail.com'}`, '_blank')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium shadow-[var(--shadow-royal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Mail className="mr-2 h-5 w-5" />
                Let's Discuss Your Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;