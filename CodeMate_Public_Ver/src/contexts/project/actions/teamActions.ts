
import { Project, TeamMember } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { generateId } from '../projectUtils';

export function addTeamMember(
  project: Project | null,
  member: Omit<TeamMember, 'id'>,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const newMember = {
    ...member,
    id: generateId(),
  };
  
  const updatedProject = {
    ...project,
    members: [...project.members, newMember],
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Team Member Added",
    description: `${member.name} has been added to the team.`,
  });
}

export function removeTeamMember(
  project: Project | null,
  memberId: string,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const memberToRemove = project.members.find(m => m.id === memberId);
  if (!memberToRemove) return;
  
  const updatedProject = {
    ...project,
    members: project.members.filter(m => m.id !== memberId),
    // Unassign tasks assigned to this member
    tasks: project.tasks.map(task => 
      task.assignee?.id === memberId 
        ? { ...task, assignee: undefined, updatedAt: new Date().toISOString() } 
        : task
    ),
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Team Member Removed",
    description: `${memberToRemove.name} has been removed from the team.`,
  });
}
