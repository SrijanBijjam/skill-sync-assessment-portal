/**
 * Resume Parser API Service
 * Handles direct file upload to the external Resume Parser API
 */

interface ParsedResumeResult {
  fullText: string;
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  skills: string;
  experience: string;
  projects: string;
  education: string;
  certifications: string;
}

/**
 * Check if the Resume Parser API is properly configured
 * @returns boolean indicating if the API can be used
 */
export function isResumeParserApiConfigured(): boolean {
  const isConfigured = (
    !!import.meta.env.VITE_RESUME_PARSER_API_URL &&
    !!import.meta.env.VITE_RESUME_PARSER_API_KEY
  );
  
  console.log(`Resume Parser API configured: ${isConfigured}`);
  if (isConfigured) {
    console.log(`API URL: ${import.meta.env.VITE_RESUME_PARSER_API_URL}`);
    // Don't log the full API key for security reasons
    console.log(`API Key: ${import.meta.env.VITE_RESUME_PARSER_API_KEY.substring(0, 4)}...`);
    
    // Check if this looks like APILayer
    const isApiLayer = import.meta.env.VITE_RESUME_PARSER_API_URL.includes('apilayer.com');
    if (isApiLayer) {
      console.log('Detected APILayer service, will use appropriate configuration');
    }
  }
  
  return isConfigured;
}

/**
 * Helper function to safely extract data from potentially nested API responses
 * @param data The API response data
 * @param paths Array of possible paths to check for the value
 * @param defaultValue Default value if not found
 * @returns The found value or default value
 */
function extractFromResponse(data: any, paths: string[], defaultValue: any = ''): any {
  for (const path of paths) {
    try {
      // Split the path into parts and traverse the object
      const parts = path.split('.');
      let value = data;
      
      for (const part of parts) {
        if (value === undefined || value === null) break;
        value = value[part];
      }
      
      if (value !== undefined && value !== null) {
        return value;
      }
    } catch (e) {
      // If there's an error accessing this path, try the next one
      continue;
    }
  }
  
  return defaultValue;
}

/**
 * Directly uploads and parses a resume file using the external Resume Parser API
 * @param file The resume file to parse
 * @returns Promise resolving to the parsed resume data
 */
export async function parseResumeWithExternalApi(file: File): Promise<ParsedResumeResult> {
  if (!isResumeParserApiConfigured()) {
    throw new Error('Resume Parser API is not configured. Please set VITE_RESUME_PARSER_API_URL and VITE_RESUME_PARSER_API_KEY environment variables.');
  }
  
  try {
    console.log(`Parsing resume using external API: ${file.name} (${file.size} bytes, type: ${file.type})`);
    
    // Create FormData to send the file
    const formData = new FormData();
    
    // Check if this is APILayer
    const isApiLayer = import.meta.env.VITE_RESUME_PARSER_API_URL.includes('apilayer.com');
    
    if (isApiLayer) {
      // APILayer expects the file with key 'file'
      formData.append('file', file);
      console.log('Using APILayer-specific field name: "file"');
      
      // If the URL doesn't include /upload at the end, append it
      let apiUrl = import.meta.env.VITE_RESUME_PARSER_API_URL;
      if (!apiUrl.endsWith('/upload')) {
        apiUrl = apiUrl.endsWith('/') ? `${apiUrl}upload` : `${apiUrl}/upload`;
        console.log(`Corrected APILayer URL to include /upload endpoint: ${apiUrl}`);
      }
      
      // Prepare headers specifically for APILayer
      const headers: Record<string, string> = {
        'apikey': import.meta.env.VITE_RESUME_PARSER_API_KEY
      };
      
      console.log(`Sending request to APILayer: ${apiUrl}`);
      console.log('Request includes file named:', file.name);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      console.log(`API response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage = `APILayer Resume Parser Error: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('API Error details:', errorData);
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          console.error('Could not parse error response as JSON');
          // Try to get text response instead
          const textResponse = await response.text();
          console.error('Raw error response:', textResponse);
          errorMessage += ` - ${textResponse.substring(0, 100)}${textResponse.length > 100 ? '...' : ''}`;
        }
        throw new Error(errorMessage);
      }
      
      const parsedData = await response.json();
      console.log('Successfully received and parsed API response');
      
      if (parsedData.success !== undefined && !parsedData.success) {
        throw new Error(`APILayer error: ${parsedData.error?.message || JSON.stringify(parsedData)}`);
      }
      
      // Log the full response structure to help debug mapping issues
      console.log('APILayer response structure:', Object.keys(parsedData));
      
      // Check for APILayer's specific response format
      const data = parsedData.data || parsedData;
      
      // Extract and log key parts for debugging
      const extractedData = {
        name: extractFromResponse(data, ['name', 'basics.name', 'contact_info.name'], 'not found'),
        email: extractFromResponse(data, ['email', 'basics.email', 'contact_info.email'], 'not found'),
        skills: extractFromResponse(data, ['skills'], []),
        // For APILayer, they often have specific formats - check the console log to see the structure
      };
      
      console.log('Extracted key data:', extractedData);
      
      // Process the APILayer specific response structure
      return processApiLayerResponse(data);
    } else {
      // Default handling for non-APILayer services
      formData.append('resume', file);
      
      // Some APIs expect specific field names, try with alternatives if needed
      if (import.meta.env.VITE_RESUME_PARSER_API_FILE_FIELD) {
        formData.append(import.meta.env.VITE_RESUME_PARSER_API_FILE_FIELD, file);
      } else {
        // Try common field names as fallbacks
        formData.append('file', file);
        formData.append('document', file);
      }
      
      // Log request details (excluding actual file contents)
      console.log(`Sending request to: ${import.meta.env.VITE_RESUME_PARSER_API_URL}`);
      
      // Prepare headers - some APIs have different authentication mechanisms
      const headers: Record<string, string> = {};
      
      // Add authorization header if API key is provided
      if (import.meta.env.VITE_RESUME_PARSER_API_KEY) {
        const authPrefix = import.meta.env.VITE_RESUME_PARSER_API_AUTH_PREFIX || 'Bearer';
        headers['Authorization'] = `${authPrefix} ${import.meta.env.VITE_RESUME_PARSER_API_KEY}`;
      }
      
      // Some APIs might use an API key in a custom header
      if (import.meta.env.VITE_RESUME_PARSER_API_KEY_HEADER) {
        headers[import.meta.env.VITE_RESUME_PARSER_API_KEY_HEADER] = import.meta.env.VITE_RESUME_PARSER_API_KEY;
      }
      
      const response = await fetch(import.meta.env.VITE_RESUME_PARSER_API_URL, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      console.log(`API response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage = `Resume Parser API Error: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.error('API Error details:', errorData);
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch (e) {
          console.error('Could not parse error response as JSON');
          // Try to get text response instead
          const textResponse = await response.text();
          console.error('Raw error response:', textResponse);
          errorMessage += ` - ${textResponse.substring(0, 100)}${textResponse.length > 100 ? '...' : ''}`;
        }
        throw new Error(errorMessage);
      }
      
      const parsedData = await response.json();
      console.log('Successfully received and parsed API response');
      
      // Log the full response structure to help debug mapping issues
      console.log('API response structure:', Object.keys(parsedData));
      if (parsedData.data) {
        console.log('Data field structure:', Object.keys(parsedData.data));
      }
      
      // Log a sample of the response data for debugging
      console.log('API response data sample:', {
        fullText: extractFromResponse(parsedData, ['fullText', 'raw_text', 'content', 'text', 'data.text'], 'not provided').substring(0, 100) + '...',
        name: extractFromResponse(parsedData, ['name', 'personalInfo.name', 'data.name', 'contact.name', 'basics.name'], 'not provided'),
        skills: Array.isArray(extractFromResponse(parsedData, ['skills', 'data.skills'], [])) 
          ? extractFromResponse(parsedData, ['skills', 'data.skills'], []).join(', ').substring(0, 100) + '...'
          : String(extractFromResponse(parsedData, ['skills', 'data.skills'], '')).substring(0, 100) + '...',
      });
      
      // Transform the API response to match our expected format
      // Handle potentially different response structures from various APIs
      return {
        fullText: extractFromResponse(parsedData, [
          'fullText', 'raw_text', 'content', 'text', 'data.text', 'data.raw_text', 'data.content'
        ], ''),
        
        personalInfo: {
          name: extractFromResponse(parsedData, [
            'name', 'personalInfo.name', 'data.name', 'contact.name', 'basics.name', 'data.contact.name'
          ]),
          email: extractFromResponse(parsedData, [
            'email', 'personalInfo.email', 'data.email', 'contact.email', 'basics.email', 'data.contact.email'
          ]),
          phone: extractFromResponse(parsedData, [
            'phone', 'personalInfo.phone', 'data.phone', 'contact.phone', 'basics.phone', 'data.contact.phone'
          ]),
          location: extractFromResponse(parsedData, [
            'location', 'personalInfo.location', 'data.location', 'contact.location', 'basics.location', 'data.contact.location'
          ]),
          linkedin: extractFromResponse(parsedData, [
            'linkedin', 'personalInfo.linkedin', 'data.linkedin', 'contact.linkedin', 'basics.linkedin', 'data.contact.linkedin', 'data.social.linkedin'
          ]),
          github: extractFromResponse(parsedData, [
            'github', 'personalInfo.github', 'data.github', 'contact.github', 'basics.github', 'data.contact.github', 'data.social.github'
          ]),
        },
        
        skills: processSkills(extractFromResponse(parsedData, [
          'skills', 'data.skills', 'skill_details', 'data.skill_details', 'skillDetails'
        ])),
        
        experience: processSection(extractFromResponse(parsedData, [
          'experience', 'work_experience', 'data.experience', 'data.work_experience', 'workExperience', 'data.workExperience'
        ])),
        
        projects: processSection(extractFromResponse(parsedData, [
          'projects', 'data.projects', 'project_details', 'data.project_details', 'projectDetails'
        ])),
        
        education: processSection(extractFromResponse(parsedData, [
          'education', 'data.education', 'education_details', 'data.education_details', 'educationDetails'
        ])),
        
        certifications: processSection(extractFromResponse(parsedData, [
          'certifications', 'data.certifications', 'certification_details', 'data.certification_details', 'certificationDetails'
        ])),
      };
    }
  } catch (error) {
    console.error('Error parsing resume with external API:', error);
    throw new Error(`Failed to parse resume with external API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Process the specific response format from APILayer
 * @param data APILayer response data
 * @returns Normalized parsed resume data
 */
function processApiLayerResponse(data: any): ParsedResumeResult {
  console.log('Processing APILayer response format');
  
  // Get the raw text
  let fullText = '';
  if (data.raw_text) {
    fullText = data.raw_text;
  } else if (data.raw_content) {
    fullText = data.raw_content;
  } else if (data.content) {
    fullText = data.content;
  }
  
  // Extract personal info
  const personalInfo: {[key: string]: string | undefined} = {};
  
  // Try to get name from various possible locations
  if (data.basics && data.basics.name) {
    personalInfo.name = data.basics.name;
  } else if (data.contact_info && data.contact_info.name) {
    personalInfo.name = data.contact_info.name;
  } else if (data.name) {
    personalInfo.name = data.name;
  }
  
  // Email
  if (data.basics && data.basics.email) {
    personalInfo.email = data.basics.email;
  } else if (data.contact_info && data.contact_info.email) {
    personalInfo.email = data.contact_info.email;
  } else if (data.email) {
    personalInfo.email = data.email;
  } else if (data.emails && data.emails.length > 0) {
    personalInfo.email = data.emails[0];
  }
  
  // Phone
  if (data.basics && data.basics.phone) {
    personalInfo.phone = data.basics.phone;
  } else if (data.contact_info && data.contact_info.phone) {
    personalInfo.phone = data.contact_info.phone;
  } else if (data.phone) {
    personalInfo.phone = data.phone;
  } else if (data.phones && data.phones.length > 0) {
    personalInfo.phone = data.phones[0];
  }
  
  // Location
  if (data.basics && data.basics.location) {
    personalInfo.location = typeof data.basics.location === 'string' 
      ? data.basics.location 
      : `${data.basics.location.city}, ${data.basics.location.region}`;
  } else if (data.contact_info && data.contact_info.location) {
    personalInfo.location = data.contact_info.location;
  } else if (data.location) {
    personalInfo.location = typeof data.location === 'string'
      ? data.location
      : `${data.location.city || ''}, ${data.location.state || ''}`;
  }
  
  // LinkedIn
  if (data.basics && data.basics.profiles) {
    const linkedinProfile = data.basics.profiles.find((p: any) => 
      p.network?.toLowerCase() === 'linkedin' || p.url?.includes('linkedin.com')
    );
    if (linkedinProfile) {
      personalInfo.linkedin = linkedinProfile.url;
    }
  } else if (data.linkedin) {
    personalInfo.linkedin = data.linkedin;
  } else if (data.social && data.social.linkedin) {
    personalInfo.linkedin = data.social.linkedin;
  } else if (data.social_links) {
    const linkedinUrl = data.social_links.find((link: string) => link.includes('linkedin.com'));
    if (linkedinUrl) {
      personalInfo.linkedin = linkedinUrl;
    }
  }
  
  // GitHub
  if (data.basics && data.basics.profiles) {
    const githubProfile = data.basics.profiles.find((p: any) => 
      p.network?.toLowerCase() === 'github' || p.url?.includes('github.com')
    );
    if (githubProfile) {
      personalInfo.github = githubProfile.url;
    }
  } else if (data.github) {
    personalInfo.github = data.github;
  } else if (data.social && data.social.github) {
    personalInfo.github = data.social.github;
  } else if (data.social_links) {
    const githubUrl = data.social_links.find((link: string) => link.includes('github.com'));
    if (githubUrl) {
      personalInfo.github = githubUrl;
    }
  }
  
  // Process skills - APILayer usually returns an array for skills
  let skills = '';
  if (data.skills) {
    if (Array.isArray(data.skills)) {
      skills = data.skills.join(', ');
    } else if (typeof data.skills === 'string') {
      skills = data.skills;
    } else if (typeof data.skills === 'object') {
      // APILayer might return skills as objects with names/values
      const skillsArr = [];
      for (const key in data.skills) {
        if (typeof data.skills[key] === 'string') {
          skillsArr.push(data.skills[key]);
        } else if (Array.isArray(data.skills[key])) {
          skillsArr.push(...data.skills[key]);
        }
      }
      skills = skillsArr.join(', ');
    }
  }
  
  // Process experience
  let experience = '';
  if (data.work_experience || data.workExperience) {
    const workExp = data.work_experience || data.workExperience;
    if (Array.isArray(workExp)) {
      experience = workExp.map((job: any) => {
        const parts = [];
        
        if (job.title) parts.push(job.title);
        if (job.company) parts.push(`at ${job.company}`);
        
        let dateRange = '';
        if (job.start_date && job.end_date) {
          dateRange = `${job.start_date} - ${job.end_date}`;
        } else if (job.dates) {
          dateRange = job.dates;
        }
        if (dateRange) parts.push(`(${dateRange})`);
        
        if (job.description) {
          parts.push(`\n${job.description}`);
        }
        
        return parts.join(' ');
      }).join('\n\n');
    } else if (typeof workExp === 'string') {
      experience = workExp;
    }
  } else if (data.experience) {
    if (typeof data.experience === 'string') {
      experience = data.experience;
    } else if (Array.isArray(data.experience)) {
      experience = processSection(data.experience);
    }
  }
  
  // Process projects
  let projects = '';
  if (data.projects) {
    if (typeof data.projects === 'string') {
      projects = data.projects;
    } else if (Array.isArray(data.projects)) {
      projects = processSection(data.projects);
    }
  }
  
  // Process education
  let education = '';
  if (data.education) {
    if (typeof data.education === 'string') {
      education = data.education;
    } else if (Array.isArray(data.education)) {
      education = data.education.map((edu: any) => {
        const parts = [];
        
        if (edu.degree) parts.push(edu.degree);
        if (edu.field_of_study) parts.push(edu.field_of_study);
        if (edu.institution) parts.push(`at ${edu.institution}`);
        
        let dateRange = '';
        if (edu.start_date && edu.end_date) {
          dateRange = `${edu.start_date} - ${edu.end_date}`;
        } else if (edu.dates) {
          dateRange = edu.dates;
        }
        if (dateRange) parts.push(`(${dateRange})`);
        
        return parts.join(' ');
      }).join('\n\n');
    }
  }
  
  // Process certifications
  let certifications = '';
  if (data.certifications) {
    if (typeof data.certifications === 'string') {
      certifications = data.certifications;
    } else if (Array.isArray(data.certifications)) {
      certifications = processSection(data.certifications);
    }
  }
  
  return {
    fullText,
    personalInfo: {
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      location: personalInfo.location,
      linkedin: personalInfo.linkedin,
      github: personalInfo.github,
    },
    skills,
    experience,
    projects,
    education,
    certifications,
  };
}

/**
 * Process skills from various API response formats into a single string
 * @param skills Skills from API (could be string, array, or object)
 * @returns Formatted skills string
 */
function processSkills(skills: any): string {
  if (!skills) return '';
  
  // If skills is already a string, return it
  if (typeof skills === 'string') return skills;
  
  // If skills is an array, join it with commas
  if (Array.isArray(skills)) {
    return skills.map(skill => {
      // Handle if each skill is an object with a name/value property
      if (typeof skill === 'object' && skill !== null) {
        return skill.name || skill.value || skill.skill || JSON.stringify(skill);
      }
      return skill;
    }).join(', ');
  }
  
  // If skills is an object, try to extract values
  if (typeof skills === 'object' && skills !== null) {
    if (Object.keys(skills).length === 0) return '';
    
    // Try to find common patterns in skills objects
    const extractedSkills = [];
    for (const key in skills) {
      const value = skills[key];
      if (typeof value === 'string') {
        extractedSkills.push(value);
      } else if (Array.isArray(value)) {
        extractedSkills.push(value.join(', '));
      } else if (typeof value === 'object' && value !== null) {
        // Recursive extraction for nested objects
        extractedSkills.push(processSkills(value));
      }
    }
    
    return extractedSkills.join(', ');
  }
  
  // Fallback: convert to string
  return String(skills);
}

/**
 * Process a section (experience, projects, etc.) from various API response formats
 * @param section Section data from API
 * @returns Formatted section string
 */
function processSection(section: any): string {
  if (!section) return '';
  
  // If section is already a string, return it
  if (typeof section === 'string') return section;
  
  // If section is an array, process each item
  if (Array.isArray(section)) {
    return section.map(item => {
      if (typeof item === 'string') return item;
      
      if (typeof item === 'object' && item !== null) {
        // Try to format as a reasonable text representation
        const parts = [];
        
        // Common fields in experience/projects sections
        if (item.title || item.role || item.position) {
          parts.push(`${item.title || item.role || item.position}`);
        }
        
        if (item.company || item.organization) {
          parts.push(`at ${item.company || item.organization}`);
        }
        
        if (item.date || item.dates || item.duration || item.period) {
          parts.push(`(${item.date || item.dates || item.duration || item.period})`);
        }
        
        if (item.description || item.summary) {
          parts.push(`\n${item.description || item.summary}`);
        }
        
        if (item.responsibilities && Array.isArray(item.responsibilities)) {
          parts.push(`\nResponsibilities:\n- ${item.responsibilities.join('\n- ')}`);
        }
        
        if (item.achievements && Array.isArray(item.achievements)) {
          parts.push(`\nAchievements:\n- ${item.achievements.join('\n- ')}`);
        }
        
        return parts.join(' ');
      }
      
      return JSON.stringify(item);
    }).join('\n\n');
  }
  
  // If section is an object, try to convert to string
  if (typeof section === 'object' && section !== null) {
    return JSON.stringify(section, null, 2);
  }
  
  // Fallback: convert to string
  return String(section);
} 