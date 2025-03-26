
import React from 'react';
import { Server } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const DevOpsSectionDetails: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="bg-black/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-codemate-blue-light">Key DevOps Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-black/20 rounded">
            <h4 className="font-semibold text-codemate-blue-light mb-2">CI/CD Pipeline Generation</h4>
            <p className="text-sm text-gray-300">Automatically create and optimize CI/CD pipelines for your projects based on their specific requirements.</p>
          </div>
          <div className="p-3 bg-black/20 rounded">
            <h4 className="font-semibold text-codemate-blue-light mb-2">Docker Configuration</h4>
            <p className="text-sm text-gray-300">Generate optimized Dockerfiles and compose files tailored to your application's needs.</p>
          </div>
          <div className="p-3 bg-black/20 rounded">
            <h4 className="font-semibold text-codemate-blue-light mb-2">Infrastructure as Code</h4>
            <p className="text-sm text-gray-300">Create and manage cloud resources with AI-generated templates for Terraform, CloudFormation, or other IaC tools.</p>
          </div>
          <div className="p-3 bg-black/20 rounded">
            <h4 className="font-semibold text-codemate-blue-light mb-2">Deployment Strategies</h4>
            <p className="text-sm text-gray-300">Implement blue-green, canary, or rolling deployment strategies with guided configuration.</p>
          </div>
        </div>
      </div>

      <div className="bg-black/20 p-6 rounded-lg font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-codemate-blue-light">// Automated DevOps Configuration</div>
          <Server className="h-4 w-4 text-codemate-blue-light" />
        </div>
        <p className="text-codemate-blue-light mb-2">// Auto-generated Jenkins Pipeline</p>
        <code className="block text-white whitespace-pre-wrap bg-black/40 p-3 rounded mb-4">
{`pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }
    stage('Deploy') {
      steps {
        sh 'docker build -t myapp:latest .'
        sh 'docker push myapp:latest'
      }
    }
  }
}`}
        </code>
        
        <Button 
          className="w-full bg-codemate-blue/30 hover:bg-codemate-blue/50 text-white mt-4"
          onClick={() => navigate('/devops')}
        >
          Explore DevOps Features
        </Button>
      </div>
    </div>
  );
};

export default DevOpsSectionDetails;
