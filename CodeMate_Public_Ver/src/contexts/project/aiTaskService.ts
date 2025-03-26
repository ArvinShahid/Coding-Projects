
import { Project, Task } from '@/types/project';
import { toast } from '@/hooks/use-toast';
import { generateId } from './projectUtils';

export async function generateTasksWithAI(
  project: Project,
  projectDescription: string,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  updateProject: (updatedProject: Project) => void
): Promise<void> {
  if (!project) return;
  
  setIsLoading(true);
  setError(null);
  
  // Check for the API key in both formats since localStorage key might vary
  const apiKey = localStorage.getItem('openai_api_key') || localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    setError("OpenAI API key not found. Please set your API key first.");
    setIsLoading(false);
    
    toast({
      title: "API Key Required",
      description: "Please set your OpenAI API key in settings to use this feature.",
      variant: "destructive",
    });
    
    return;
  }
  
  // Combine project description from the project and any additional vision text
  const combinedDescription = `
Project name: ${project.name}
Project description: ${project.description}
Additional project vision/details: ${projectDescription || ''}
  `.trim();
  
  try {
    // Make API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a project management AI assistant that creates detailed task breakdowns.
            For the given project description, generate 10-15 realistic tasks that would be needed to complete the project.
            For each task, include:
            - A clear, concise title
            - A detailed description of what needs to be done
            - Priority (low, medium, high, urgent)
            - Appropriate status (start with most in backlog or todo)
            - Tags (1-3 relevant categories)
            
            Format your response as a JSON array of tasks that can be parsed directly.`
          },
          {
            role: "user",
            content: combinedDescription
          }
        ],
        temperature: 0.7,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API call failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    const generatedTasksText = data.choices[0].message.content;
    
    // Extract JSON from response (handle cases where JSON might be wrapped in markdown)
    const jsonMatch = generatedTasksText.match(/\[[\s\S]*\]/);
    const tasksJson = jsonMatch ? jsonMatch[0] : generatedTasksText;
    
    console.log("Generated tasks JSON:", tasksJson);
    
    let generatedTasks;
    try {
      generatedTasks = JSON.parse(tasksJson);
    } catch (parseError) {
      console.error("Error parsing tasks JSON:", parseError);
      throw new Error("Failed to parse the generated tasks. Try again or check your API key.");
    }
    
    // Convert to our task format and add
    const now = new Date().toISOString();
    const newTasks: Task[] = generatedTasks.map((task: any) => ({
      id: generateId(),
      title: task.title,
      description: task.description,
      status: task.status || 'backlog',
      priority: task.priority || 'medium',
      tags: task.tags || [],
      createdAt: now,
      updatedAt: now,
    }));
    
    // Assign tasks to available members if there are any
    const assignableTasks = [...newTasks];
    if (project.members.length > 0) {
      for (let i = 0; i < assignableTasks.length; i++) {
        const memberIndex = i % project.members.length;
        assignableTasks[i].assignee = project.members[memberIndex];
      }
    }
    
    const updatedProject = {
      ...project,
      tasks: [...project.tasks, ...assignableTasks],
      updatedAt: now,
    };
    
    updateProject(updatedProject);
    
    toast({
      title: "Tasks Generated",
      description: `${newTasks.length} tasks were created based on your project description and vision.`,
    });
    
  } catch (err) {
    console.error('Failed to generate tasks with AI:', err);
    setError(err instanceof Error ? err.message : 'Failed to generate tasks with AI');
    
    toast({
      title: "Task Generation Failed",
      description: err instanceof Error ? err.message : 'Failed to generate tasks with AI',
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}
