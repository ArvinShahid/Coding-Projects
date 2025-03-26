
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectOverview from './ProjectOverview';
import KanbanBoard from './KanbanBoard';
import TeamManagement from './TeamManagement';
import GithubIntegrationPanel from './GithubIntegrationPanel';
import { ProjectProvider } from '@/contexts/ProjectContext';

const ProjectManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <ProjectProvider>
      <div className="container mx-auto px-4">
        {/* Removing the duplicate heading here */}
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="board">Kanban Board</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <ProjectOverview />
          </TabsContent>
          
          <TabsContent value="board" className="mt-0">
            <KanbanBoard />
          </TabsContent>
          
          <TabsContent value="team" className="mt-0">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="github" className="mt-0">
            <GithubIntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </ProjectProvider>
  );
};

export default ProjectManagerDashboard;
