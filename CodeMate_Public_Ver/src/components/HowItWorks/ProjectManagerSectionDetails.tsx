
import React from 'react';
import { ClipboardList, Play, Code } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const ProjectManagerSectionDetails: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="bg-black/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-green-400">Project Management Tools:</h3>
        <div className="space-y-4">
          <div className="p-3 bg-black/20 rounded flex items-start">
            <div className="bg-green-400/20 p-2 rounded mr-3 mt-1">
              <ClipboardList className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">AI-Powered Task Creation</h4>
              <p className="text-sm text-gray-300">Describe your project goals and let AI break them down into actionable tasks with appropriate priorities and dependencies.</p>
            </div>
          </div>
          
          <div className="p-3 bg-black/20 rounded flex items-start">
            <div className="bg-green-400/20 p-2 rounded mr-3 mt-1">
              <Play className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">Smart Sprint Planning</h4>
              <p className="text-sm text-gray-300">Automatically organize tasks into sprints based on team capacity, priorities, and dependencies.</p>
            </div>
          </div>
          
          <div className="p-3 bg-black/20 rounded flex items-start">
            <div className="bg-green-400/20 p-2 rounded mr-3 mt-1">
              <Code className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-1">GitHub Integration</h4>
              <p className="text-sm text-gray-300">Sync with your GitHub repositories to automatically create tasks from issues and track progress through commits and PRs.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/20 p-6 rounded-lg font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-green-400">// Project Management Dashboard</div>
          <ClipboardList className="h-4 w-4 text-green-400" />
        </div>
        <p className="text-white mb-2">Sprint Planning Example:</p>
        <div className="space-y-3">
          <div className="bg-black/30 p-3 rounded-lg">
            <div className="text-codemate-purple-light">Feature: User Authentication</div>
            <div className="text-gray-400 text-xs mt-1">Priority: High | Assigned: Sarah | 8 Story Points</div>
            <div className="text-gray-300 text-xs mt-2 bg-black/20 p-1.5 rounded">
              AI analysis: This task is critical for the project's security. Recommend completing in the current sprint.
            </div>
          </div>
          <div className="bg-black/30 p-3 rounded-lg">
            <div className="text-codemate-blue-light">Feature: Payment Integration</div>
            <div className="text-gray-400 text-xs mt-1">Priority: Medium | Assigned: John | 13 Story Points</div>
            <div className="text-gray-300 text-xs mt-2 bg-black/20 p-1.5 rounded">
              AI analysis: Based on team velocity, this task should be scheduled for the next sprint.
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-green-500/30 hover:bg-green-500/50 text-white mt-4"
          onClick={() => navigate('/project-manager')}
        >
          Try Project Manager
        </Button>
      </div>
    </div>
  );
};

export default ProjectManagerSectionDetails;
