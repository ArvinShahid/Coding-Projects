
import React, { useState } from 'react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TestTube, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { generateTestCases } from "@/utils/openAiService";

const testFormSchema = z.object({
  description: z.string().min(10, { message: "Please provide a more detailed description." }),
});

export type TestFormValues = z.infer<typeof testFormSchema>;

const TestsTab = () => {
  const [generatedTests, setGeneratedTests] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: TestFormValues) => {
    console.log("Test form data:", data);
    setIsGenerating(true);
    
    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast({
          title: "API Key Required",
          description: "Please set your OpenAI API key in the settings",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      
      const tests = await generateTestCases(data.description, apiKey);
      if (tests) {
        setGeneratedTests(tests);
        toast({
          title: "Tests Generated",
          description: "Integration tests have been successfully generated.",
        });
      }
    } catch (error) {
      console.error("Error generating tests:", error);
      toast({
        title: "Error",
        description: "Failed to generate test cases",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedTests], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "integration.test.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10">
          <CardHeader>
            <CardTitle>Intelligent Test Generation</CardTitle>
            <CardDescription>
              Generate integration tests for your application based on a feature description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the feature you want to test, e.g.: A user authentication system with login and registration endpoints. The login endpoint accepts email and password and returns a JWT token. The registration endpoint accepts email, password, and name and creates a new user."
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the feature or component you want to test in detail. The more specific you are, the better the generated tests will be.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-codemate-purple to-codemate-blue"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <TestTube className="h-4 w-4 mr-2 animate-spin" />
                      Generating Tests...
                    </>
                  ) : (
                    <>
                      <TestTube className="h-4 w-4 mr-2" />
                      Generate Tests
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Generated Tests</CardTitle>
              <CardDescription>
                Your AI-generated integration tests
              </CardDescription>
            </div>
            {generatedTests && (
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
              {generatedTests ? (
                <pre className="whitespace-pre-wrap">{generatedTests}</pre>
              ) : (
                <div className="text-gray-500 italic">
                  Your generated tests will appear here...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestsTab;
