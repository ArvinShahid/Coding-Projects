
import { Project, Task, TaskStatus } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { generateId } from '../projectUtils';

export function addTask(
  project: Project | null,
  taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const now = new Date().toISOString();
  const newTask: Task = {
    ...taskData,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  const updatedProject = {
    ...project,
    tasks: [...project.tasks, newTask],
    updatedAt: now,
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Task Added",
    description: "New task has been created.",
  });
}

export function updateTask(
  project: Project | null,
  taskId: string, 
  updates: Partial<Task>,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const updatedProject = {
    ...project,
    tasks: project.tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() } 
        : task
    ),
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Task Updated",
    description: "Task has been updated successfully.",
  });
}

export function deleteTask(
  project: Project | null,
  taskId: string,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const updatedProject = {
    ...project,
    tasks: project.tasks.filter(task => task.id !== taskId),
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
  
  toast({
    title: "Task Deleted",
    description: "Task has been removed.",
  });
}

export function moveTask(
  project: Project | null,
  taskId: string, 
  newStatus: TaskStatus,
  setProject: (project: Project) => void
): void {
  if (!project) return;
  
  const updatedProject = {
    ...project,
    tasks: project.tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus, updatedAt: new Date().toISOString() } 
        : task
    ),
    updatedAt: new Date().toISOString(),
  };
  
  setProject(updatedProject);
}
