
import { toast } from "@/hooks/use-toast";

interface Idea {
  title: string;
  description: string;
  problem: string;
  solution: string;
}

export const generateIdeasAPI = async (topic: string): Promise<Idea[]> => {
  const apiKey = localStorage.getItem('openai_api_key') || localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    throw new Error("OpenAI API key not found. Please set your API key first.");
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI that helps developers find project ideas for hackathons based on trending problems.
          For the given topic, provide 3 project ideas that solve real-world problems that would be suitable for a hackathon.
          Focus on innovative, impactful projects that can be completed in 24-48 hours by a small team.
          Format your response as a JSON array with objects containing:
          - title: A catchy project name for a hackathon
          - description: A brief project description suitable for a hackathon pitch
          - problem: The specific problem this solves
          - solution: How the project addresses the problem in an innovative way`
        },
        {
          role: "user",
          content: `Generate 3 hackathon project ideas related to "${topic}" that solve real problems. Make sure they're innovative and feasible to build in 24-48 hours by a small team.`
        }
      ],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to generate ideas");
  }

  const data = await response.json();
  const ideasText = data.choices[0].message.content;
  
  // Extract JSON from response
  const jsonMatch = ideasText.match(/\[[\s\S]*\]/);
  const ideasJson = jsonMatch ? jsonMatch[0] : ideasText;
  
  return JSON.parse(ideasJson);
};

export const expandIdeaAPI = async (idea: Idea): Promise<string> => {
  const apiKey = localStorage.getItem('openai_api_key') || localStorage.getItem('openai-api-key');
  
  if (!apiKey) {
    throw new Error("OpenAI API key not found. Please set your API key first.");
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI hackathon project vision expert. For the given project idea, expand it into a comprehensive project vision with user stories and MVP features that can be built during a hackathon.`
        },
        {
          role: "user",
          content: `Expand this hackathon project idea:
          Title: ${idea.title}
          Description: ${idea.description}
          Problem: ${idea.problem}
          Solution: ${idea.solution}
          
          Create a vision statement that includes:
          1. Overall project vision
          2. 3-5 key user stories in the format "As a [user type], I want to [action] so that [benefit]"
          3. MVP features that could be completed in a 24-48 hour hackathon
          4. What makes this project innovative and impactful
          
          Format it in a way that would help a team plan their hackathon project.`
        }
      ],
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to expand idea");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
