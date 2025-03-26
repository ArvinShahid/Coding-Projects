
import { Project, TeamMember } from '@/types/project';

// Helper to generate a unique ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Demo data for the project
export const createDemoProject = (): Project => {
  const demoTeamMembers: TeamMember[] = [
    {
      id: generateId(),
      name: 'Alex Johnson',
      email: 'alex@codemate.io',
      role: 'Frontend Developer',
      avatarUrl: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6E59A5&color=fff',
    },
    {
      id: generateId(),
      name: 'Sarah Miller',
      email: 'sarah@codemate.io',
      role: 'Backend Developer',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=8B5CF6&color=fff',
    },
    {
      id: generateId(),
      name: 'Jamie Chen',
      email: 'jamie@codemate.io',
      role: 'UI/UX Designer',
      avatarUrl: 'https://ui-avatars.com/api/?name=Jamie+Chen&background=F97316&color=fff',
    },
    {
      id: generateId(),
      name: 'Taylor Wilson',
      email: 'taylor@codemate.io',
      role: 'Project Manager',
      avatarUrl: 'https://ui-avatars.com/api/?name=Taylor+Wilson&background=0EA5E9&color=fff',
    }
  ];

  const now = new Date().toISOString();
  const lastWeek = new Date(Date.now() - 604800000).toISOString();

  // Start with an empty tasks array
  return {
    id: generateId(),
    name: 'CodeMate Web Application',
    description: 'A collaborative coding platform with real-time features, AI-assisted code reviews, and integrated project management tools. The application aims to streamline development workflows and enhance team productivity.',
    tasks: [], // Empty tasks array for demo until AI generates them
    members: demoTeamMembers,
    githubRepo: 'https://github.com/codemate/web-app',
    createdAt: lastWeek,
    updatedAt: now,
  };
};

// Initial empty project
export const createEmptyProject = (): Project => ({
  id: generateId(),
  name: 'New Project',
  description: 'Project description',
  tasks: [],
  members: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
