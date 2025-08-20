import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LogOut, User, FileText, FolderOpen, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminProfile from '@/components/admin/AdminProfile';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminContact from '@/components/admin/AdminContact';
import AdminAccount from '@/components/admin/AdminAccount';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="border-b border-border/20 bg-background/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-primary">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shadow-[var(--shadow-card)] hover:shadow-xl transition-all duration-300"
              >
                View Site
              </Button>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="bg-destructive hover:bg-destructive/90 shadow-[var(--shadow-card)] hover:shadow-xl transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)] h-fit">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Navigation</CardTitle>
              <CardDescription>Manage your portfolio content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === 'profile' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('profile')}
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Profile & Bio
              </Button>
              <Button
                variant={activeTab === 'projects' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('projects')}
                className="w-full justify-start"
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Projects
              </Button>
              <Button
                variant={activeTab === 'contact' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('contact')}
                className="w-full justify-start"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Info
              </Button>
              <Button
                variant={activeTab === 'account' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('account')}
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile">
                <AdminProfile />
              </TabsContent>
              <TabsContent value="projects">
                <AdminProjects />
              </TabsContent>
              <TabsContent value="contact">
                <AdminContact />
              </TabsContent>
              <TabsContent value="account">
                <AdminAccount />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;