
import { Project } from '@/types/project';
import { toast } from '@/hooks/use-toast';

export function createProject(
  name: string, 
  description: string,
  emptyProjectTemplate: () => Project, 
  setProject: (project: Project) => void
): void {
  const newProject = {
    ...emptyProjectTemplate(),
    name,
    description,
  };
  setProject(newProject);
  toast({
    title: "Project Created",
    description: `${name} has been created successfully.`,
  });
}

export function updateProjectInfo(
  project: Project | null,
  name: string, 
  description: string,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const updatedProject = {
    ...project,
    name,
    description,
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Project Updated",
    description: "Project information has been updated.",
  });
}
