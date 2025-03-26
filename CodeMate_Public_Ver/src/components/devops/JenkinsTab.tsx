
import React, { useState } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Server, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const jenkinsFormSchema = z.object({
  projectName: z.string().min(2, { message: "Project name must be at least 2 characters." }),
  buildSteps: z.string().min(10, { message: "Please describe your build steps in more detail." }),
  deployEnvironment: z.string().min(2, { message: "Please specify a deployment environment." }),
  pipelineType: z.enum(["declarative", "scripted"]),
});

export type JenkinsFormValues = z.infer<typeof jenkinsFormSchema>;

const JenkinsTab = () => {
  const [jenkinsFile, setJenkinsFile] = useState("");
  const { toast } = useToast();

  const form = useForm<JenkinsFormValues>({
    resolver: zodResolver(jenkinsFormSchema),
    defaultValues: {
      projectName: "",
      buildSteps: "",
      deployEnvironment: "production",
      pipelineType: "declarative",
    },
  });

  const onSubmit = (data: JenkinsFormValues) => {
    console.log("Jenkins form data:", data);
    
    const jenkinsfileContent = generateJenkinsfile(data);
    setJenkinsFile(jenkinsfileContent);
    
    toast({
      title: "Jenkinsfile Generated",
      description: "Your Jenkinsfile has been successfully generated.",
    });
  };

  const generateJenkinsfile = (data: JenkinsFormValues) => {
    if (data.pipelineType === "declarative") {
      return `pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building ${data.projectName}'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests'
                sh 'npm run test'
            }
        }
        
        stage('Deploy to ${data.deployEnvironment}') {
            steps {
                echo 'Deploying to ${data.deployEnvironment}'
                ${data.buildSteps.split('\n').map(step => `sh '${step}'`).join('\n                ')}
            }
        }
    }
    
    post {
        success {
            echo '${data.projectName} deployed successfully to ${data.deployEnvironment}!'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}`;
    } else {
      return `node {
    try {
        stage('Build') {
            echo 'Building ${data.projectName}'
            sh 'npm install'
            sh 'npm run build'
        }
        
        stage('Test') {
            echo 'Running tests'
            sh 'npm run test'
        }
        
        stage('Deploy to ${data.deployEnvironment}') {
            echo 'Deploying to ${data.deployEnvironment}'
            ${data.buildSteps.split('\n').map(step => `sh '${step}'`).join('\n            ')}
        }
        
        echo '${data.projectName} deployed successfully to ${data.deployEnvironment}!'
    } catch (e) {
        echo 'Deployment failed'
        throw e
    }
}`;
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([jenkinsFile], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Jenkinsfile";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle>Jenkins Pipeline Configuration</CardTitle>
            <CardDescription>
              Configure your Jenkins pipeline to automate your build, test, and deployment process.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="my-awesome-project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pipelineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pipeline Type</FormLabel>
                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          onClick={() => field.onChange("declarative")}
                          className={cn(
                            "flex-1",
                            field.value === "declarative" 
                              ? "bg-gradient-to-r from-codemate-purple to-codemate-blue" 
                              : "bg-black/30"
                          )}
                        >
                          Declarative
                        </Button>
                        <Button
                          type="button"
                          onClick={() => field.onChange("scripted")}
                          className={cn(
                            "flex-1",
                            field.value === "scripted" 
                              ? "bg-gradient-to-r from-codemate-purple to-codemate-blue" 
                              : "bg-black/30"
                          )}
                        >
                          Scripted
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deployEnvironment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployment Environment</FormLabel>
                      <FormControl>
                        <Input placeholder="production, staging, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buildSteps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Build & Deploy Steps</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="npm run build
aws s3 sync ./dist s3://my-bucket
aws cloudfront create-invalidation --distribution-id ABCDEF --paths '/*'" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each command on a new line. These will be executed in order.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue">
                  Generate Jenkinsfile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Jenkinsfile</CardTitle>
              <CardDescription>
                Your generated Jenkins pipeline configuration
              </CardDescription>
            </div>
            {jenkinsFile && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="bg-black/30 p-4 rounded-md overflow-auto h-[400px] font-mono text-sm">
              {jenkinsFile ? (
                <pre className="whitespace-pre-wrap">{jenkinsFile}</pre>
              ) : (
                <div className="text-gray-500 italic">
                  Your Jenkinsfile will appear here after generation...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JenkinsTab;
