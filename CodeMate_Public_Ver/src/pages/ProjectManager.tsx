
import React from 'react';
import Navbar from '@/components/Navbar';
import ProjectManagerDashboard from '@/components/project-manager/ProjectManagerDashboard';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProjectManager = () => {
  const resetDemo = () => {
    localStorage.removeItem('currentProject');
    window.location.reload();
    
    toast({
      title: "Demo Reset",
      description: "The demo project has been reset to its initial state.",
    });
  };

  return (
    <div className="min-h-screen bg-codemate-dark text-white">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text hidden md:block">Project Manager AI</h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 ml-auto" 
            onClick={resetDemo}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Demo
          </Button>
        </div>
        <ProjectManagerDashboard />
      </div>
    </div>
  );
};

export default ProjectManager;
