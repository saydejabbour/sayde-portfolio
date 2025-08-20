import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Save, X, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string | null;
  link: string | null;
  created_at: string;
}

const AdminProjects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('projects')
        .insert({
          title,
          description,
          technologies: technologies.split(',').map(tech => tech.trim()),
          link: link || null,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Project created',
        description: 'New project has been added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Creation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateProject = useMutation({
    mutationFn: async () => {
      if (!editingProject) return;
      
      const { error } = await supabase
        .from('projects')
        .update({
          title,
          description,
          technologies: technologies.split(',').map(tech => tech.trim()),
          link: link || null,
        })
        .eq('id', editingProject.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Project updated',
        description: 'Project has been updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Project deleted',
        description: 'Project has been deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Deletion failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTechnologies('');
    setLink('');
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(project.technologies.join(', '));
    setLink(project.link || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingProject) {
      updateProject.mutate();
    } else {
      createProject.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card/50 backdrop-blur-sm shadow-[var(--shadow-royal)]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Manage your portfolio projects
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProject ? 'Update project information' : 'Fill in the details for your new project'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter project title"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your project..."
                      rows={3}
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="technologies"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      placeholder="e.g., React, TypeScript, Node.js"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">Project Link (optional)</Label>
                    <Input
                      id="link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={createProject.isPending || updateProject.isPending}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingProject ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No projects yet. Add your first project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="border border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                      <div className="flex space-x-1">
                        {project.link && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(project.link!, '_blank')}
                            className="h-8 w-8"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(project)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteProject.mutate(project.id)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProjects;