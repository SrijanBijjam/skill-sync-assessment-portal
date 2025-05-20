
import { ProfileData } from '@/hooks/useProfileData';
import { jobDescription } from '@/config/jobDescription';

// Define types for OpenAI responses
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
    finish_reason: string;
  }[];
}

// Default retry configuration
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Formats the profile data into a structured string for the AI prompt
function formatProfileData(profileData: ProfileData): string {
  const { personalInfo, skillsExperience, resumeText, hiringManagerQuestions } = profileData;
  
  return `
# CANDIDATE PROFILE

## PERSONAL INFORMATION
${personalInfo.name ? `Name: ${personalInfo.name}` : ''}
${personalInfo.email ? `Email: ${personalInfo.email}` : ''}
${personalInfo.phone ? `Phone: ${personalInfo.phone}` : ''}
${personalInfo.location ? `Location: ${personalInfo.location}` : ''}
${personalInfo.github ? `Github: ${personalInfo.github}` : ''}
${personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin}` : ''}

## SKILLS & EXPERIENCE
${skillsExperience.skills ? `Skills: ${skillsExperience.skills}` : ''}
${skillsExperience.experience ? `Experience: ${skillsExperience.experience}` : ''}
${skillsExperience.projects ? `Projects: ${skillsExperience.projects}` : ''}
${skillsExperience.certifications ? `Certifications: ${skillsExperience.certifications}` : ''}

## RESUME TEXT
${resumeText}

## HIRING MANAGER QUESTIONS
${hiringManagerQuestions.technicalProblem ? `Technical Problem: ${hiringManagerQuestions.technicalProblem}` : ''}
${hiringManagerQuestions.continuousLearning ? `Continuous Learning: ${hiringManagerQuestions.continuousLearning}` : ''}
${hiringManagerQuestions.performanceOptimization ? `Performance Optimization: ${hiringManagerQuestions.performanceOptimization}` : ''}
`;
}

// Formats the job description into a structured string for the AI prompt
function formatJobDescription(): string {
  return `
# JOB DESCRIPTION

## POSITION
Title: ${jobDescription.title}
Location: ${jobDescription.location}

## COMPANY DETAILS
Team Size: ${jobDescription.companyDetails.teamSize}
Industry: ${jobDescription.companyDetails.industry}
Reports To: ${jobDescription.companyDetails.reportsTo}

## SUMMARY
${jobDescription.summary}

## RESPONSIBILITIES
${jobDescription.responsibilities.map((resp, index) => `${index + 1}. ${resp}`).join('\n')}

## REQUIREMENTS
${jobDescription.requirements.map((req, index) => `${index + 1}. ${req}`).join('\n')}

## COMPENSATION & BENEFITS
Compensation: ${jobDescription.compensation}
Benefits: ${jobDescription.benefits}
`;
}

/**
 * Calls the OpenAI API with retry logic
 */
async function callOpenAI(
  messages: OpenAIMessage[],
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY
): Promise<string> {
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries <= maxRetries) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      lastError = error as Error;
      retries += 1;
      console.error(`OpenAI API call failed (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries <= maxRetries) {
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, retries - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Maximum retries reached for OpenAI API call');
}

/**
 * Generates a professional profile summary using the candidate's data
 */
export async function generateProfileSummary(profileData: ProfileData): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an expert career advisor and resume writer. Your task is to create a concise, professional summary of a job candidate based on their profile information. Focus on highlighting their relevant skills, experience, and qualifications. Be objective and professional. The summary should be 2-3 paragraphs.`
    },
    {
      role: 'user',
      content: formatProfileData(profileData)
    }
  ];
  
  try {
    return await callOpenAI(messages);
  } catch (error) {
    console.error('Error generating profile summary:', error);
    return 'Unable to generate profile summary at this time. Please try again later.';
  }
}

/**
 * Analyzes the match between the candidate's profile and job description
 */
export async function analyzeJobMatch(profileData: ProfileData): Promise<{
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  skillsAnalysis: { [key: string]: number };
  summary: string;
}> {
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are an AI recruiting assistant specializing in job matching analysis. Analyze the candidate's profile against the job description and provide:
      
1. An overall match score (0-100)
2. A list of 3-5 strengths (skills/experiences that align well with the job)
3. A list of 2-4 gaps or improvement areas
4. A list of 2-3 specific recommendations for the candidate
5. A skills analysis with scores (0-100) for these categories: Computer Science Fundamentals, C++ Programming, Low-Latency Development, Team Collaboration, Software Engineering Practices
6. A brief summary paragraph explaining the match results

Format your response as valid JSON like this:
{
  "score": 75,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "gaps": ["Gap 1", "Gap 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "skillsAnalysis": {
    "Computer Science Fundamentals": 80,
    "C++ Programming": 70,
    "Low-Latency Development": 60,
    "Team Collaboration": 90,
    "Software Engineering Practices": 75
  },
  "summary": "Summary text here."
}`
    },
    {
      role: 'user',
      content: `
# CANDIDATE PROFILE:
${formatProfileData(profileData)}

# JOB DESCRIPTION TO MATCH AGAINST:
${formatJobDescription()}

Please analyze how well this candidate matches the job requirements and provide detailed feedback as JSON.`
    }
  ];
  
  try {
    const response = await callOpenAI(messages);
    let parsed;
    
    try {
      parsed = JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse OpenAI response as JSON:', e);
      console.log('Raw response:', response);
      
      // Attempt to extract JSON from the response if it wasn't pure JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          throw new Error('Could not extract valid JSON from response');
        }
      } else {
        throw new Error('Response did not contain valid JSON');
      }
    }
    
    return {
      score: parsed.score || 0,
      strengths: parsed.strengths || [],
      gaps: parsed.gaps || [],
      recommendations: parsed.recommendations || [],
      skillsAnalysis: parsed.skillsAnalysis || {
        "Computer Science Fundamentals": 0,
        "C++ Programming": 0,
        "Low-Latency Development": 0,
        "Team Collaboration": 0,
        "Software Engineering Practices": 0
      },
      summary: parsed.summary || "Unable to generate summary."
    };
  } catch (error) {
    console.error('Error analyzing job match:', error);
    return {
      score: 0,
      strengths: ['Unable to analyze strengths at this time.'],
      gaps: ['Unable to analyze gaps at this time.'],
      recommendations: ['Please try again later.'],
      skillsAnalysis: {
        "Computer Science Fundamentals": 0,
        "C++ Programming": 0,
        "Low-Latency Development": 0,
        "Team Collaboration": 0,
        "Software Engineering Practices": 0
      },
      summary: "An error occurred while analyzing the job match. Please try again later."
    };
  }
}
