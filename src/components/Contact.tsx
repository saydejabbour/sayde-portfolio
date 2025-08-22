import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Phone, Mail, MapPin, Github, Copy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
const Contact = () => {
  const {
    data: contact
  } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('contact').select('*').single();
      if (error) throw error;
      return data;
    }
  });

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const getGitHubUrl = (github: string | null) => {
    if (!github) return 'https://github.com/saydejabbour';
    if (github.startsWith('http')) return github;
    return `https://github.com/${github}`;
  };

  const contactMethods = [
    {
      icon: Phone,
      label: 'Phone',
      value: contact?.phone || '+961 81 336 237',
      href: `tel:${contact?.phone || '+961 81 336 237'}`,
      buttonText: 'Call',
      ariaLabel: `Call ${contact?.phone || '+961 81 336 237'}`,
      color: 'from-green-500/20 to-green-600/20',
      external: false
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact?.email || 'sayde.jabbour04@hotmail.com',
      href: `mailto:${contact?.email || 'sayde.jabbour04@hotmail.com'}?subject=Portfolio%20Inquiry&body=Hi%20Sayde,`,
      buttonText: 'Email me',
      ariaLabel: `Email ${contact?.email || 'sayde.jabbour04@hotmail.com'}`,
      color: 'from-blue-500/20 to-blue-600/20',
      external: false
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contact?.location || 'Koura, Lebanon',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact?.location || 'Koura, Lebanon')}`,
      buttonText: 'Open Map',
      ariaLabel: `Open map for ${contact?.location || 'Koura, Lebanon'}`,
      color: 'from-red-500/20 to-red-600/20',
      external: true
    },
    {
      icon: Github,
      label: 'GitHub',
      value: contact?.github || 'saydejabbour',
      href: getGitHubUrl(contact?.github),
      buttonText: 'View GitHub',
      ariaLabel: `Open ${contact?.github || 'saydejabbour'}'s GitHub`,
      color: 'from-gray-500/20 to-gray-600/20',
      external: true
    }
  ];

  return (
    <TooltipProvider>
      <section id="contact" className="py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              Get in Touch
            </h2>
            <div className="w-20 h-1 bg-primary mb-8"></div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Ready to collaborate on your next project? Let's connect and discuss how we can work together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="relative group">
                <a
                  href={method.href}
                  {...(method.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={method.ariaLabel}
                  className="block"
                >
                  <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-500 hover:-translate-y-2 group-hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                    <CardHeader className="text-center pb-2">
                      <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <method.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{method.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0 space-y-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm text-muted-foreground truncate">
                            {method.value}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{method.value}</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={(e) => e.preventDefault()}
                      >
                        {method.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </a>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(method.value, method.label);
                  }}
                  aria-label={`Copy ${method.label}`}
                >
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};
export default Contact;