import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { signIn, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
        toast({
          title: 'Access Denied',
          description: 'Only the site owner can access admin.',
          variant: 'destructive',
        });
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message || 'Please check your credentials and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Set redirecting state
      setRedirecting(true);
      
      // Ensure session is ready
      await supabase.auth.getSession();
      
      // Get user and their profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found after sign-in');

      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Redirect based on role
      if (userProfile?.role === 'admin') {
        toast({
          title: 'Login Successful',
          description: 'Welcome back! Redirecting to admin panel...',
        });
        navigate('/admin', { replace: true });
      } else {
        toast({
          title: 'Access Denied',
          description: 'Only the site owner can access admin.',
          variant: 'destructive',
        });
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gradient-hero)] p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      <Card className="w-full max-w-md border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)] relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin panel
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-royal)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              disabled={loading || redirecting}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : redirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
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

export default Login;