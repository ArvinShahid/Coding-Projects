
import { Project, Task, TeamMember, TaskStatus } from '@/types/project';

export interface ProjectContextType {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  createProject: (name: string, description: string) => void;
  updateProjectInfo: (name: string, description: string) => void;
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  removeTeamMember: (memberId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  setGithubRepo: (repoUrl: string) => void;
  generateTasksWithAI: (projectDescription: string) => Promise<void>;
}
