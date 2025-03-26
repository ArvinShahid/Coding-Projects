
import React, { useState } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Container, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const dockerFormSchema = z.object({
  baseImage: z.string().min(2, { message: "Base image is required." }),
  ports: z.string().min(1, { message: "At least one port must be specified." }),
  volumes: z.string().optional(),
  env: z.string().optional(),
  useCompose: z.boolean().default(false),
  services: z.string().optional(),
});

export type DockerFormValues = z.infer<typeof dockerFormSchema>;

const DockerTab = () => {
  const [dockerFile, setDockerFile] = useState("");
  const [dockerComposeFile, setDockerComposeFile] = useState("");
  const { toast } = useToast();

  const form = useForm<DockerFormValues>({
    resolver: zodResolver(dockerFormSchema),
    defaultValues: {
      baseImage: "node:18-alpine",
      ports: "3000:3000",
      volumes: "./:/app",
      env: "NODE_ENV=production",
      useCompose: false,
      services: "",
    },
  });

  const onSubmit = (data: DockerFormValues) => {
    console.log("Docker form data:", data);
    
    const dockerfileContent = generateDockerfile(data);
    setDockerFile(dockerfileContent);
    
    if (data.useCompose) {
      const dockerComposeContent = generateDockerCompose(data);
      setDockerComposeFile(dockerComposeContent);
      
      toast({
        title: "Docker Files Generated",
        description: "Your Dockerfile and docker-compose.yml have been successfully generated.",
      });
    } else {
      setDockerComposeFile("");
      
      toast({
        title: "Dockerfile Generated",
        description: "Your Dockerfile has been successfully generated.",
      });
    }
  };

  const generateDockerfile = (data: DockerFormValues) => {
    return `FROM ${data.baseImage}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

${data.env ? `ENV ${data.env}` : ''}

EXPOSE ${data.ports.split(',')[0].split(':')[0]}

CMD ["npm", "start"]`;
  };

  const generateDockerCompose = (data: DockerFormValues) => {
    let services = `  app:
    build: .
    ports:
      - "${data.ports}"
    ${data.volumes ? `volumes:
      - ${data.volumes}` : ''}
    ${data.env ? `environment:
      - ${data.env.replace(/,/g, '\n      - ')}` : ''}`;

    if (data.services) {
      const additionalServices = data.services.split('\n').join('\n  ');
      services += `\n  ${additionalServices}`;
    }

    return `version: '3'

services:
${services}`;
  };

  const handleDownload = (content: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle>Docker Configuration</CardTitle>
            <CardDescription>
              Configure your Docker environment for containerizing your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="baseImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Image</FormLabel>
                      <FormControl>
                        <Input placeholder="node:18-alpine" {...field} />
                      </FormControl>
                      <FormDescription>
                        The base Docker image for your application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ports</FormLabel>
                      <FormControl>
                        <Input placeholder="3000:3000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: hostPort:containerPort, comma-separated for multiple ports
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="volumes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volumes</FormLabel>
                      <FormControl>
                        <Input placeholder="./:/app" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: hostPath:containerPath
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="env"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment Variables</FormLabel>
                      <FormControl>
                        <Input placeholder="NODE_ENV=production" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: KEY=value, comma-separated for multiple variables
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="useCompose"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Generate docker-compose.yml</FormLabel>
                        <FormDescription>
                          For multi-container applications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-6 h-6 accent-codemate-purple"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {form.watch("useCompose") && (
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Services</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="db:
  image: postgres:14
  environment:
    - POSTGRES_PASSWORD=postgres
    - POSTGRES_USER=postgres
  ports:
    - 5432:5432" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Additional services for docker-compose.yml (in YAML format)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <Button type="submit" className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue">
                  Generate Docker Files
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dockerfile</CardTitle>
                <CardDescription>
                  Your generated Docker configuration
                </CardDescription>
              </div>
              {dockerFile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => handleDownload(dockerFile, "Dockerfile")}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="bg-black/30 p-4 rounded-md overflow-auto h-[200px] font-mono text-sm">
                {dockerFile ? (
                  <pre className="whitespace-pre-wrap">{dockerFile}</pre>
                ) : (
                  <div className="text-gray-500 italic">
                    Your Dockerfile will appear here after generation...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {form.watch("useCompose") && (
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>docker-compose.yml</CardTitle>
                  <CardDescription>
                    Your generated Docker Compose configuration
                  </CardDescription>
                </div>
                {dockerComposeFile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDownload(dockerComposeFile, "docker-compose.yml")}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-black/30 p-4 rounded-md overflow-auto h-[170px] font-mono text-sm">
                  {dockerComposeFile ? (
                    <pre className="whitespace-pre-wrap">{dockerComposeFile}</pre>
                  ) : (
                    <div className="text-gray-500 italic">
                      Your docker-compose.yml will appear here after generation...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DockerTab;
