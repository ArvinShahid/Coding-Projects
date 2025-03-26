
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ClipboardList, Rocket, Users, Github, LoaderCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

const ProjectOverview: React.FC = () => {
  const { 
    project, 
    updateProjectInfo, 
    generateTasksWithAI,
    isLoading 
  } = useProject();
  
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [projectVision, setProjectVision] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectInfo(name, description);
    setIsEditing(false);
  };
  
  const handleGenerateTasks = () => {
    // Pass both project description (from state) and additional project vision
    generateTasksWithAI(projectVision);
  };
  
  const tasksByStatus = project?.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-morphism border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Manage your project information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="project-name" className="text-sm text-gray-300">
                    Project Name
                  </label>
                  <Input
                    id="project-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/30 border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="project-description" className="text-sm text-gray-300">
                    Project Description
                  </label>
                  <Textarea
                    id="project-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-black/30 border-white/10 min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400">Project Name</h3>
                  <p className="text-lg">{project?.name}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400">Description</h3>
                  <p className="text-sm text-gray-200">{project?.description}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Project
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              AI Task Generation
            </CardTitle>
            <CardDescription>
              Generate tasks based on your project description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                Our AI can analyze your project description and generate a list of tasks to help you get started quickly.
              </p>
              <div className="space-y-2">
                <label htmlFor="ai-prompt" className="text-sm text-gray-300">
                  Project Vision (Optional)
                </label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Provide additional details about your project goals, technologies, or specific requirements..."
                  className="bg-black/30 border-white/10 min-h-[100px]"
                  value={projectVision}
                  onChange={(e) => setProjectVision(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue hover:opacity-90"
              onClick={handleGenerateTasks}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  Generating Tasks...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Generate Tasks with AI
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-morphism border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project?.tasks.length || 0}</div>
            <div className="text-xs text-gray-400 mt-1">
              {tasksByStatus.backlog || 0} Backlog · {tasksByStatus.todo || 0} Todo · {tasksByStatus['in-progress'] || 0} In Progress · {tasksByStatus.done || 0} Done
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{project?.members.length || 0}</div>
            <div className="text-xs text-gray-400 mt-1">
              {project?.members.length ? 'Team assembled' : 'No members yet'}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">GitHub</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base font-medium">
              {project?.githubRepo ? (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span className="truncate">{project.githubRepo}</span>
                </div>
              ) : (
                <span className="text-gray-400">Not connected</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectOverview;
