
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TeamMember;
  dueDate?: string;
  calendarEventUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  githubIssueId?: number;
  githubIssueUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  members: TeamMember[];
  githubRepo?: string;
  createdAt: string;
  updatedAt: string;
}
