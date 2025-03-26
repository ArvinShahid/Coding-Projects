
import { toast } from "@/hooks/use-toast";
import { TestResults } from "@/hooks/useCodeEditor";

// OpenAI API endpoints
const API_URL = "https://api.openai.com/v1";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Helper function to clean code from markdown code blocks
const cleanCodeFromMarkdown = (content: string): string => {
  // Remove markdown code block indicators (```javascript, ```js, ```, etc.)
  let cleanedCode = content.trim();
  
  // Remove opening code fence with any language identifier
  cleanedCode = cleanedCode.replace(/^```[\w]*\n/gm, '');
  
  // Remove closing code fence
  cleanedCode = cleanedCode.replace(/```$/gm, '');
  
  return cleanedCode.trim();
};

export const generateTestCases = async (featureDescription: string, apiKey: string): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a test-driven development expert. Generate Jest test cases based on the feature description provided."
          },
          {
            role: "user",
            content: `Create comprehensive Jest test cases for the following feature:\n\n${featureDescription}\n\nPlease return only the JavaScript/TypeScript code without explanations.`
          }
        ],
        max_tokens: 1000,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate test cases");
    }

    const data = await response.json() as OpenAIResponse;
    return cleanCodeFromMarkdown(data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating test cases:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate test cases",
      variant: "destructive"
    });
    return null;
  }
};

export const generateImplementation = async (
  testCases: string, 
  apiKey: string, 
  existingCode: string,
  testResults?: TestResults
): Promise<string | null> => {
  try {
    // Create messages array with context
    const messages = [
      {
        role: "system" as const,
        content: `You are an expert programmer. Your task is to modify the existing calculator code to pass all tests.
        
        IMPORTANT GUIDELINES:
        1. Preserve all existing functionality - all previously passing tests must continue to pass
        2. Maintain the exact same code style, formatting, and comment style as the original code
        3. Only modify what's necessary to implement the new functionality
        4. Keep the same validation patterns and error handling approach
        5. Match variable naming conventions from the existing code
        6. Follow the same documentation style with JSDoc comments
        7. CRITICAL: Make sure all functions are correctly included in the module.exports object
        8. If implementing new functions, follow the exact naming convention used in the tests
        9. Be careful with function names in the tests; if tests use addExponent, your function should be named addExponent
        10. Add a log statement before module.exports to verify all functions exist
        11. Format the module.exports object exactly like the original, just adding any new functions
        12. Return only pure code, do NOT wrap it in code blocks or markdown formatting`
      },
      {
        role: "user" as const,
        content: `Here is the existing implementation code:\n\n${existingCode}\n\nModify this code to pass these test cases while following all the guidelines:\n\n${testCases}\n\nReturn only the complete modified code without explanations. The code should follow the exact same style as the original.`
      }
    ];
    
    // Add failing test information if available
    if (testResults && testResults.failing > 0 && testResults.failingTests) {
      const failingTests = testResults.failingTests.map(test => 
        `- "${test.name}": ${test.error}`
      ).join('\n');
      
      messages.push({
        role: "user" as const,
        content: `The previous implementation failed these tests:\n${failingTests}\n\nMake sure to fix all these failing tests while maintaining all functionality that was working before. Ensure all functions are properly exported in module.exports, following EXACTLY the naming convention used in tests.`
      });
    }

    // Extract required function names from test cases
    const functionNameMatches = testCases.match(/expect\(([a-zA-Z]+)\(/g) || [];
    const functionNames = functionNameMatches.map(match => match.replace('expect(', '').replace('(', ''));
    
    if (functionNames.length > 0) {
      messages.push({
        role: "user" as const,
        content: `I found these function names in the tests: ${functionNames.join(', ')}. Make sure ALL these functions are implemented with EXACTLY these names and included in the module.exports object. Do not rename any functions - match the test expectations exactly.`
      });
    }

    const response = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate implementation");
    }

    const data = await response.json() as OpenAIResponse;
    return cleanCodeFromMarkdown(data.choices[0].message.content);
  } catch (error) {
    console.error("Error generating implementation:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate implementation",
      variant: "destructive"
    });
    return null;
  }
};
