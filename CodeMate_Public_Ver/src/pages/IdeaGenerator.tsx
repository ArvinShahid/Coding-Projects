
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProjectProvider } from '@/contexts/ProjectContext';
import IdeasList from '@/components/idea-generator/IdeasList';
import ProjectVisionPanel from '@/components/idea-generator/ProjectVisionPanel';
import { useIdeaGenerator } from '@/hooks/useIdeaGenerator';

const IdeaGeneratorContent = () => {
  const {
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
  } = useIdeaGenerator();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 gradient-text">Hackathon Idea Generator</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Generate innovative hackathon project ideas and turn them into actionable tasks for your team
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <IdeasList
                topic={topic}
                setTopic={setTopic}
                isLoading={isLoading}
                ideas={ideas}
                onGenerateIdeas={generateIdeas}
                onExpandIdea={expandIdea}
              />
            </div>
            
            <div>
              <ProjectVisionPanel
                selectedIdea={selectedIdea}
                projectVision={projectVision}
                onProjectVisionChange={setProjectVision}
                onPopulateProjectManager={populateProjectManager}
                projectTimeline={projectTimeline}
                onProjectTimelineChange={setProjectTimeline}
                techStack={techStack}
                onTechStackChange={setTechStack}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Main component that wraps the IdeaGeneratorContent with ProjectProvider
const IdeaGenerator = () => {
  return (
    <ProjectProvider>
      <IdeaGeneratorContent />
    </ProjectProvider>
  );
};

export default IdeaGenerator;
