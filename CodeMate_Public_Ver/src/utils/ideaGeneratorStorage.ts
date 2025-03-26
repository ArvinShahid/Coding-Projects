
import { Idea, SelectedIdea } from "@/types/ideaGenerator";

export const loadTopic = (): string => {
  const savedTopic = localStorage.getItem('ideaGenerator_topic');
  return savedTopic || '';
};

export const saveTopic = (topic: string): void => {
  localStorage.setItem('ideaGenerator_topic', topic);
};

export const loadIdeas = (): Idea[] => {
  const savedIdeas = localStorage.getItem('ideaGenerator_ideas');
  return savedIdeas ? JSON.parse(savedIdeas) : [];
};

export const saveIdeas = (ideas: Idea[]): void => {
  localStorage.setItem('ideaGenerator_ideas', JSON.stringify(ideas));
};

export const loadSelectedIdea = (): SelectedIdea | null => {
  const savedSelectedIdea = localStorage.getItem('ideaGenerator_selectedIdea');
  return savedSelectedIdea ? JSON.parse(savedSelectedIdea) : null;
};

export const saveSelectedIdea = (selectedIdea: SelectedIdea | null): void => {
  localStorage.setItem('ideaGenerator_selectedIdea', JSON.stringify(selectedIdea));
};

export const loadProjectVision = (): string => {
  const savedProjectVision = localStorage.getItem('ideaGenerator_projectVision');
  return savedProjectVision || '';
};

export const saveProjectVision = (projectVision: string): void => {
  localStorage.setItem('ideaGenerator_projectVision', projectVision);
};

export const loadProjectTimeline = (): Date | undefined => {
  const savedTimeline = localStorage.getItem('ideaGenerator_projectTimeline');
  return savedTimeline 
    ? new Date(savedTimeline) 
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // Default to 3 days (typical hackathon)
};

export const saveProjectTimeline = (projectTimeline: Date | undefined): void => {
  if (projectTimeline) {
    localStorage.setItem('ideaGenerator_projectTimeline', projectTimeline.toISOString());
  }
};

export const loadTechStack = (): string[] => {
  const savedTechStack = localStorage.getItem('ideaGenerator_techStack');
  return savedTechStack ? JSON.parse(savedTechStack) : [];
};

export const saveTechStack = (techStack: string[]): void => {
  localStorage.setItem('ideaGenerator_techStack', JSON.stringify(techStack));
};
