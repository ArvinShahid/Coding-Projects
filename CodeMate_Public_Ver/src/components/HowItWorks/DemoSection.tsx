import React from 'react';
import { Code, Server, ClipboardList, BarChart, Lightbulb } from 'lucide-react';
import TDDSectionDetails from './TDDSectionDetails';
import DevOpsSectionDetails from './DevOpsSectionDetails';
import ProjectManagerSectionDetails from './ProjectManagerSectionDetails';
import DataAnalyticsSectionDetails from './DataAnalyticsSectionDetails';

export interface DemoSectionProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: string;
  details: React.ReactNode;
}

// Define a new Idea Generator section details component for the interactive demo
const IdeaGeneratorSectionDetails = () => {
  return (
    <div className="space-y-4">
      <p className="text-gray-300">
        Our AI Idea Generator helps you spark innovation and explore new project possibilities:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-400 mb-2">Market Analysis</h3>
          <p className="text-sm text-gray-400">Analyze current market trends and identify opportunities for innovative solutions.</p>
        </div>
        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-400 mb-2">Problem Identification</h3>
          <p className="text-sm text-gray-400">Pinpoint specific problems in your target domain that need solving.</p>
        </div>
        <div className="bg-black/30 p-4 rounded-md">
          <h3 className="font-semibold text-yellow-400 mb-2">Solution Generation</h3>
          <p className="text-sm text-gray-400">Create innovative solution concepts with implementation strategies.</p>
        </div>
      </div>
    </div>
  );
};

export const getDemoSections = (): DemoSectionProps[] => [
  {
    id: 'project-manager',
    title: 'AI Project Manager',
    description: 'Let AI help manage your projects with task tracking, resource allocation, and smart scheduling suggestions.',
    icon: <ClipboardList className="h-8 w-8 text-green-400" />,
    animation: 'fade-in',
    details: <ProjectManagerSectionDetails />
  },
  {
    id: 'idea-generator',
    title: 'AI Idea Generator',
    description: 'Generate innovative project ideas tailored to your interests and market needs with AI assistance.',
    icon: <Lightbulb className="h-8 w-8 text-yellow-400" />,
    animation: 'fade-in',
    details: <IdeaGeneratorSectionDetails />
  },
  {
    id: 'tdd',
    title: 'AI Test-Driven Development',
    description: 'Start with requirements, get automatically generated tests, then implement your code with AI assistance.',
    icon: <Code className="h-8 w-8 text-codemate-purple-light" />,
    animation: 'fade-in',
    details: <TDDSectionDetails />
  },
  {
    id: 'devops',
    title: 'DevOps Automation',
    description: 'Streamline your CI/CD pipelines, infrastructure management, and deployment process with AI guidance.',
    icon: <Server className="h-8 w-8 text-codemate-blue-light" />,
    animation: 'slide-in',
    details: <DevOpsSectionDetails />
  },
  {
    id: 'data-analytics',
    title: 'AI Data Analytics',
    description: 'Analyze, visualize, and extract insights from your data with powerful AI-assisted tools.',
    icon: <BarChart className="h-8 w-8 text-purple-400" />,
    animation: 'fade-in',
    details: <DataAnalyticsSectionDetails />
  }
];

export const DemoSection: React.FC<{
  section: DemoSectionProps;
  active: boolean;
  onSectionRef: (element: HTMLDivElement | null) => void;
}> = ({ section, active, onSectionRef }) => {
  return (
    <div 
      ref={onSectionRef}
      className="demo-section snap-center h-[calc(100vh-7rem)] py-16 flex items-center"
    >
      <div className="container max-w-5xl mx-auto px-4">
        <div className={`glass-morphism p-8 rounded-xl animate-${section.animation}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-black/30 p-3 rounded-lg w-16 h-16 flex items-center justify-center mb-2 mx-auto">
              {section.icon}
            </div>
            <div className="ml-4">
              <h2 className="text-3xl font-bold">{section.title}</h2>
              <p className="text-lg text-gray-300">{section.description}</p>
            </div>
          </div>
          
          {section.details}
        </div>
      </div>
    </div>
  );
};

export default DemoSection;
