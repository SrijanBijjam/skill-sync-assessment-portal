
import { toast } from "@/hooks/use-toast";

// Define the profile type that will be used across the app
export interface UserProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
  };
  skills: string[];
  experience: string;
  projects: string;
  education: string;
  resumeText?: string;
}

export interface JobMatch {
  overallMatch: number;
  skillsAnalysis: {
    name: string;
    percentage: number;
  }[];
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

// Function to analyze a resume text
export async function analyzeResume(resumeText: string): Promise<Partial<UserProfile>> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes resumes and extracts key information. Parse the following resume text and return a JSON structure with these fields:
              - skills (array of strings)
              - experience (summary string)
              - education (string)
              - projects (string if mentioned)
              Return ONLY valid JSON without any explanation or markdown formatting.`
          },
          {
            role: 'user',
            content: resumeText
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const parsedResult = JSON.parse(data.choices[0].message.content);
    
    return {
      skills: parsedResult.skills || [],
      experience: parsedResult.experience || '',
      education: parsedResult.education || '',
      projects: parsedResult.projects || '',
      resumeText
    };
  } catch (error) {
    console.error('Error analyzing resume:', error);
    toast({
      title: "Resume Analysis Error",
      description: "There was a problem analyzing your resume. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

// Function to analyze job match
export async function analyzeJobMatch(
  jobDescription: string, 
  profile: Partial<UserProfile>
): Promise<JobMatch> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes job descriptions and compares them to candidate profiles.
              Compare the job description with the candidate's profile and return a JSON object with these fields:
              - overallMatch: number between 0-100 representing the percentage match
              - skillsAnalysis: array of objects with "name" and "percentage" fields for key skills mentioned in the job
              - strengths: array of strings describing candidate's strengths related to this job
              - improvements: array of strings describing areas where the candidate could improve
              - recommendation: string with tailored advice for the candidate
              Return ONLY valid JSON without any explanation or markdown formatting.`
          },
          {
            role: 'user',
            content: `Job Description:\n${jobDescription}\n\nCandidate Profile:\n${JSON.stringify(profile)}`
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const parsedResult = JSON.parse(data.choices[0].message.content);
    
    return {
      overallMatch: parsedResult.overallMatch || 0,
      skillsAnalysis: parsedResult.skillsAnalysis || [],
      strengths: parsedResult.strengths || [],
      improvements: parsedResult.improvements || [],
      recommendation: parsedResult.recommendation || ''
    };
  } catch (error) {
    console.error('Error analyzing job match:', error);
    toast({
      title: "Job Match Analysis Error",
      description: "There was a problem analyzing your job match. Please try again.",
      variant: "destructive",
    });
    throw new Error('Failed to analyze job match');
  }
}
