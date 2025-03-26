
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, TeamMember, TaskStatus } from '@/types/project';
import { ProjectContextType } from './types';
import { 
  createDemoProject, 
  createEmptyProject 
} from './projectUtils';
import { 
  createProject as createProjectAction,
  updateProjectInfo as updateProjectInfoAction,
  addTeamMember as addTeamMemberAction,
  removeTeamMember as removeTeamMemberAction,
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
  moveTask as moveTaskAction,
  setGithubRepo as setGithubRepoAction,
} from './actions';
import { generateTasksWithAI as generateTasksWithAIService } from './aiTaskService';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load project from localStorage on mount, or use demo data if none exists
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        setProject(JSON.parse(savedProject));
      } catch (e) {
        console.error('Failed to parse saved project', e);
        setProject(createDemoProject());
      }
    } else {
      // Use demo project by default
      setProject(createDemoProject());
    }
  }, []);

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (project) {
      localStorage.setItem('currentProject', JSON.stringify(project));
    }
  }, [project]);

  // Project actions wrapped with state management
  const createProject = (name: string, description: string) => {
    createProjectAction(name, description, createEmptyProject, setProject);
  };

  const updateProjectInfo = (name: string, description: string) => {
    updateProjectInfoAction(project, name, description, setProject);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    addTeamMemberAction(project, member, setProject);
  };

  const removeTeamMember = (memberId: string) => {
    removeTeamMemberAction(project, memberId, setProject);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTaskAction(project, task, setProject);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskAction(project, taskId, updates, setProject);
  };

  const deleteTask = (taskId: string) => {
    deleteTaskAction(project, taskId, setProject);
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    moveTaskAction(project, taskId, newStatus, setProject);
  };

  const setGithubRepo = (repoUrl: string) => {
    setGithubRepoAction(project, repoUrl, setProject);
  };

  const generateTasksWithAI = async (projectDescription: string) => {
    if (!project) return;
    await generateTasksWithAIService(
      project, 
      projectDescription, 
      setIsLoading, 
      setError, 
      setProject
    );
  };

  const value = {
    project,
    isLoading,
    error,
    createProject,
    updateProjectInfo,
    addTeamMember,
    removeTeamMember,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    setGithubRepo,
    generateTasksWithAI,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
