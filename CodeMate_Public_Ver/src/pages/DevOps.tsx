
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Container, TestTube, Github } from 'lucide-react';
import { Button } from "@/components/ui/button";
import JenkinsTab from '../components/devops/JenkinsTab';
import DockerTab from '../components/devops/DockerTab';
import TestsTab from '../components/devops/TestsTab';
import GithubIntegration from '../components/GithubIntegration';

const DevOps = () => {
  const [activeTab, setActiveTab] = useState("jenkins");
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="glass-morphism rounded-xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold gradient-text">DevOps Automation</h1>
              <Button 
                variant="outline" 
                className="gap-2 border-white/20 hover:border-white/40"
                onClick={() => setIsGithubModalOpen(true)}
              >
                <Github className="h-5 w-5" />
                <span>Connect to GitHub</span>
              </Button>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg mb-6">
              <p className="text-white/80">
                Connect your GitHub repository to enhance your DevOps experience. Our AI assistant will help you generate, 
                customize, and integrate Jenkins pipelines, Docker configurations, and intelligent tests with your 
                existing CI/CD workflows.
              </p>
            </div>
            
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="jenkins" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Jenkins Integration
                </TabsTrigger>
                <TabsTrigger value="docker" className="flex items-center gap-2">
                  <Container className="h-4 w-4" />
                  Docker Integration
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Intelligent Tests
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="jenkins">
                <JenkinsTab />
              </TabsContent>
              
              <TabsContent value="docker">
                <DockerTab />
              </TabsContent>
              
              <TabsContent value="tests">
                <TestsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
      
      <GithubIntegration 
        isOpen={isGithubModalOpen} 
        onClose={() => setIsGithubModalOpen(false)} 
      />
    </div>
  );
};

export default DevOps;
