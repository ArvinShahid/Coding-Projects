
import { Project } from '@/types/project';
import { toast } from '@/hooks/use-toast';

export function setGithubRepo(
  project: Project | null,
  repoUrl: string,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const updatedProject = {
    ...project,
    githubRepo: repoUrl,
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "GitHub Repository Connected",
    description: "Project is now linked to GitHub repository.",
  });
}
