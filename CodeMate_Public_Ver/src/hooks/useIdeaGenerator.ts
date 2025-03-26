
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useProject } from '@/contexts/ProjectContext';
import { Idea, SelectedIdea } from '@/types/ideaGenerator';
import { generateIdeasAPI, expandIdeaAPI } from '@/services/ideaGeneratorService';
import {
  loadTopic, saveTopic,
  loadIdeas, saveIdeas,
  loadSelectedIdea, saveSelectedIdea,
  loadProjectVision, saveProjectVision,
  loadProjectTimeline, saveProjectTimeline,
  loadTechStack, saveTechStack
} from '@/utils/ideaGeneratorStorage';

export const useIdeaGenerator = () => {
  // Initialize state from localStorage
  const [topic, setTopic] = useState<string>(loadTopic);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<Idea[]>(loadIdeas);
  const [selectedIdea, setSelectedIdea] = useState<SelectedIdea | null>(loadSelectedIdea);
  const [projectVision, setProjectVision] = useState<string>(loadProjectVision);
  const [projectTimeline, setProjectTimeline] = useState<Date | undefined>(loadProjectTimeline);
  const [techStack, setTechStack] = useState<string[]>(loadTechStack);
  
  const { generateTasksWithAI } = useProject();

  // Save state to localStorage when it changes
  useEffect(() => { saveTopic(topic); }, [topic]);
  useEffect(() => { saveIdeas(ideas); }, [ideas]);
  useEffect(() => { saveSelectedIdea(selectedIdea); }, [selectedIdea]);
  useEffect(() => { saveProjectVision(projectVision); }, [projectVision]);
  useEffect(() => { 
    if (projectTimeline) {
      saveProjectTimeline(projectTimeline);
    }
  }, [projectTimeline]);
  useEffect(() => { saveTechStack(techStack); }, [techStack]);

  const generateIdeas = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate ideas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIdeas([]);
    setSelectedIdea(null);

    try {
      const parsedIdeas = await generateIdeasAPI(topic);
      setIdeas(parsedIdeas);

      toast({
        title: "Hackathon Ideas Generated",
        description: `Generated ${parsedIdeas.length} project ideas related to "${topic}"`,
      });
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate ideas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const expandIdea = async (idea: Idea) => {
    setIsLoading(true);
    
    try {
      const vision = await expandIdeaAPI(idea);
      setSelectedIdea({...idea, vision});
      setProjectVision(vision);
      
    } catch (error) {
      console.error("Error expanding idea:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to expand idea",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const populateProjectManager = async () => {
    if (!selectedIdea || !projectVision) {
      toast({
        title: "No Idea Selected",
        description: "Please select an idea to populate the project manager",
        variant: "destructive",
      });
      return;
    }

    try {
      // Include the project timeline and tech stack in the context
      const timelineInfo = projectTimeline 
        ? `\n\nHackathon Deadline: ${projectTimeline.toISOString().split('T')[0]}.` 
        : '';
      
      const techStackInfo = techStack.length > 0
        ? `\n\nTech Stack: ${techStack.join(', ')}.`
        : '';
      
      const hackathonContext = `\nThis is a hackathon project that needs to be completed in a short timeframe (24-48 hours). Focus on MVP features and prioritize tasks accordingly. Break down the project into small, achievable tasks that a small team can complete during a hackathon.`;
      
      await generateTasksWithAI(projectVision + timelineInfo + techStackInfo + hackathonContext);
      toast({
        title: "Hackathon Project Plan Created",
        description: "Tasks have been generated and added to your Project Manager",
      });
    } catch (error) {
      console.error("Error populating project manager:", error);
      toast({
        title: "Error",
        description: "Failed to populate project manager",
        variant: "destructive",
      });
    }
  };

  return {
    topic,
    setTopic,
    isLoading,
    ideas,
    selectedIdea,
    projectVision,
    setProjectVision,
    projectTimeline,
    setProjectTimeline,
    techStack,
    setTechStack,
    generateIdeas,
    expandIdea,
    populateProjectManager
  };
};
