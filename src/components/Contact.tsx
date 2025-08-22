import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Phone, Mail, MapPin, Github, Copy, ChevronDown } from 'lucide-react';
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
      } = await supabase.from('contact').select('*').maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const copyToClipboard = async (text: string, toastMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: toastMessage,
      });
    } catch (err) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  // Normalize phone to E.164 format (digits only, keep leading +)
  const normalizePhone = (phone: string | null) => {
    if (!phone) return '+96181336237';
    // Remove all non-digit characters except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Ensure it starts with + if it doesn't already
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  };

  // Platform detection for cross-platform map links
  const getPlatform = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    
    if (/iphone|ipad|ipod/.test(userAgent) || platform.includes('mac')) {
      return 'ios';
    } else if (/android/.test(userAgent)) {
      return 'android';
    } else {
      return 'desktop';
    }
  };

  const getMapUrls = (location: string) => {
    const q = encodeURIComponent(location);
    const platform = getPlatform();
    
    const urls = {
      ios: {
        primary: `maps://?q=${q}`,
        fallback: `https://maps.apple.com/?q=${q}`,
        target: '_self'
      },
      android: {
        primary: `geo:0,0?q=${q}`,
        fallback: `https://maps.google.com/?q=${q}`,
        target: '_self'
      },
      desktop: {
        primary: `https://maps.google.com/?q=${q}`,
        fallback: `https://www.openstreetmap.org/search?query=${q}`,
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    };

    return {
      ...urls[platform],
      openstreetmap: `https://www.openstreetmap.org/search?query=${q}`,
      bing: `https://www.bing.com/maps?q=${q}`
    };
  };

  const getGitHubUrl = (github: string | null) => {
    if (!github) return 'https://github.com/saydejabbour';
    if (github.startsWith('http')) return github;
    return `https://github.com/${github}`;
  };

  const normalizedPhone = normalizePhone(contact?.phone);
  const email = contact?.email || 'sayde.jabbour04@hotmail.com';
  const location = contact?.location || 'Koura, Lebanon';
  const githubUrl = getGitHubUrl(contact?.github);
  const githubHandle = contact?.github || 'saydejabbour';
  const mapUrls = getMapUrls(location);

  const contactMethods = [
    {
      icon: Phone,
      label: 'Phone',
      value: normalizedPhone,
      href: `tel:${normalizedPhone}`,
      buttonText: 'Call',
      ariaLabel: 'Call Sayde',
      color: 'from-green-500/20 to-green-600/20',
      target: '_self',
      copyText: normalizedPhone,
      copyToast: 'Number copied'
    },
    {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}?subject=Portfolio%20Inquiry&body=Hi%20Sayde,%0D%0A`,
      buttonText: 'Email me',
      ariaLabel: 'Email Sayde',
      color: 'from-blue-500/20 to-blue-600/20',
      target: '_self',
      copyText: email,
      copyToast: 'Email copied'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: location,
      href: mapUrls.primary,
      buttonText: 'Open Map',
      ariaLabel: 'Open map',
      color: 'from-red-500/20 to-red-600/20',
      target: mapUrls.target as '_self' | '_blank',
      rel: (mapUrls as any).rel,
      copyText: location,
      copyToast: 'Address copied',
      isLocation: true
    },
    {
      icon: Github,
      label: 'GitHub',
      value: githubHandle,
      href: githubUrl,
      buttonText: 'View GitHub',
      ariaLabel: 'Open GitHub',
      color: 'from-gray-500/20 to-gray-600/20',
      target: '_blank',
      rel: 'noopener noreferrer',
      copyText: githubUrl,
      copyToast: 'GitHub copied'
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
                  target={method.target}
                  {...(method.rel ? { rel: method.rel } : {})}
                  role="button"
                  aria-label={method.ariaLabel}
                  tabIndex={0}
                  className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.location.href = method.href;
                    }
                  }}
                >
                  <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-royal)] transition-all duration-500 hover:-translate-y-2 group-hover:scale-[1.02] cursor-pointer">
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
                      
                      <div className="flex flex-col gap-2">
                        <div className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          {method.buttonText}
                        </div>
                        
                        {(method as any).isLocation && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                More options <ChevronDown className="h-3 w-3 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              className="w-48 bg-background border border-border shadow-lg z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem asChild>
                                <a
                                  href={mapUrls.openstreetmap}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  OpenStreetMap
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={mapUrls.bing}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Bing Maps
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-primary/10 z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    copyToClipboard(method.copyText, method.copyToast);
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