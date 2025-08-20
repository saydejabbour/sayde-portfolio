import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'admin')
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error checking admin:', error);
          setAdminExists(false);
        } else {
          setAdminExists(!!data);
        }
      } catch (error) {
        console.error('Error checking admin:', error);
        setAdminExists(false);
      }
    };

    checkAdminExists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminExists) {
      toast({
        title: 'Signups Closed',
        description: 'An admin already exists.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: 'Signup Failed',
          description: error.message || 'Please try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Please check your email for verification.',
        });
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (adminExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-hero)] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        <div className="text-center relative z-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-hero)] p-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)] relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Signups Closed</CardTitle>
            <CardDescription>
              Signups are closed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <Link to="/login">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-royal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  Go to Login
                </Button>
              </Link>
              <Link 
                to="/" 
                className="block text-sm text-muted-foreground hover:underline"
              >
                ← Back to site
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-hero)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)] relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Create Admin Account</CardTitle>
          <CardDescription>
            Create the first admin account for this site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-royal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Admin Account'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-sm text-primary hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Back to site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;