
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getDemoSections } from '../components/HowItWorks/DemoSection';
import TDDSectionDetails from '../components/HowItWorks/TDDSectionDetails';
import DevOpsSectionDetails from '../components/HowItWorks/DevOpsSectionDetails';
import ProjectManagerSectionDetails from '../components/HowItWorks/ProjectManagerSectionDetails';
import DataAnalyticsSectionDetails from '../components/HowItWorks/DataAnalyticsSectionDetails';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const demoSections = getDemoSections();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 gradient-text">How CodeMate Works</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how our AI-powered tools transform your development workflow from planning to deployment
            </p>
          </div>
          
          <div className="space-y-16">
            {/* Project Manager Section (Idea Generator) */}
            <Card className="bg-black/30 border-green-500/30">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-green-400 mb-2">AI Project Manager</h2>
                  <p className="text-gray-300">
                    Let AI help manage your projects with task tracking, resource allocation, and smart scheduling suggestions.
                  </p>
                </div>
                <ProjectManagerSectionDetails />
              </CardContent>
            </Card>

            {/* Idea Generator Section */}
            <Card className="bg-black/30 border-yellow-500/30">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-2">AI Idea Generator</h2>
                  <p className="text-gray-300">
                    Generate innovative project ideas tailored to your interests and market needs with AI assistance.
                  </p>
                </div>
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
                  <div className="mt-6 p-4 bg-black/40 rounded-lg border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-400 mb-2">Workflow Example</h3>
                    <ol className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                        <span>Enter your interests, domain, or target market</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                        <span>Review AI-generated project ideas complete with problem statements and solutions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                        <span>Refine your selected idea into a detailed project vision</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-yellow-500/20 text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
                        <span>Automatically populate the project manager with tasks based on your vision</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* TDD Section */}
            <Card className="bg-black/30 border-codemate-purple/30">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-codemate-purple-light mb-2">AI Test-Driven Development</h2>
                  <p className="text-gray-300">
                    Start with requirements, get automatically generated tests, then implement your code with AI assistance.
                  </p>
                </div>
                <TDDSectionDetails />
              </CardContent>
            </Card>
            
            {/* DevOps Section */}
            <Card className="bg-black/30 border-codemate-blue/30">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-codemate-blue-light mb-2">DevOps Automation</h2>
                  <p className="text-gray-300">
                    Streamline your CI/CD pipelines, infrastructure management, and deployment process with AI guidance.
                  </p>
                </div>
                <DevOpsSectionDetails />
              </CardContent>
            </Card>
            
            {/* Data Analytics Section */}
            <Card className="bg-black/30 border-purple-500/30">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-purple-400 mb-2">AI Data Analytics</h2>
                  <p className="text-gray-300">
                    Analyze, visualize, and extract insights from your data with powerful AI-assisted tools.
                  </p>
                </div>
                <DataAnalyticsSectionDetails />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
