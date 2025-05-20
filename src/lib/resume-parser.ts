
// Import PDF.js with correct path for ES5 modules
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

// Initialize PDF.js worker (required for PDF parsing)
const pdfjsVersion = '2.16.105'; // Match the version we're using
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

/**
 * Extract text content from a PDF file
 * @param file PDF file to extract text from
 * @returns Promise resolving to the extracted text
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => 
        'str' in item ? item.str : '');
      
      fullText += textItems.join(' ') + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

interface ParsedResumeData {
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
 * Extract specific resume sections using pattern matching
 */
export function extractSections(text: string): ParsedResumeData {
  // Initialize return structure
  const result: ParsedResumeData = {
    fullText: text,
    personalInfo: {},
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
  };

  // Extract personal information
  // Name extraction - often at the top of resume
  const nameMatch = text.match(/^([A-Z][a-z]+(\s[A-Z][a-z]+)+)/m);
  if (nameMatch) result.personalInfo.name = nameMatch[1].trim();

  // Email extraction
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  // Phone extraction - look for common phone number formats
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];

  // Location extraction - common pattern for city, state, etc.
  const locationMatch = text.match(/([A-Za-z\s]+,\s*[A-Z]{2})/);
  if (locationMatch) result.personalInfo.location = locationMatch[0];

  // LinkedIn URL extraction
  const linkedinMatch = text.match(/linkedin\.com\/in\/[A-Za-z0-9_-]+/);
  if (linkedinMatch) result.personalInfo.linkedin = `https://${linkedinMatch[0]}`;

  // GitHub URL extraction
  const githubMatch = text.match(/github\.com\/[A-Za-z0-9_-]+/);
  if (githubMatch) result.personalInfo.github = `https://${githubMatch[0]}`;

  // Extract skills section - look for various headings
  const skillsRegex = /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES|EXPERTISE|PROFICIENCIES|TECHNICAL EXPERTISE)[:\s]*\n+([\s\S]*?)(?=\n\s*\n|\n[A-Z][A-Z\s]+[:\s]*\n|\Z)/i;
  const skillsMatch = text.match(skillsRegex);
  if (skillsMatch && skillsMatch[1]) {
    result.skills = skillsMatch[1].trim().replace(/\n+/g, ', ');
  }

  // Extract experience section - look for various headings
  const experienceRegex = /(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|CAREER HISTORY|WORK HISTORY)[:\s]*\n+([\s\S]*?)(?=\n\s*\n\s*(?:EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|ACTIVITIES|VOLUNTEER|REFERENCES|ADDITIONAL)[A-Z\s]*[:\s]*\n|\Z)/i;
  const experienceMatch = text.match(experienceRegex);
  if (experienceMatch && experienceMatch[1]) {
    result.experience = experienceMatch[1].trim();
  }

  // Extract projects section - look for various headings
  const projectsRegex = /(?:PROJECTS|SOFTWARE PROJECTS|PERSONAL PROJECTS|KEY PROJECTS|NOTABLE PROJECTS|RELEVANT PROJECTS)[:\s]*\n+([\s\S]*?)(?=\n\s*\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|ACTIVITIES|VOLUNTEER|REFERENCES|ADDITIONAL)[A-Z\s]*[:\s]*\n|\Z)/i;
  const projectsMatch = text.match(projectsRegex);
  if (projectsMatch && projectsMatch[1]) {
    result.projects = projectsMatch[1].trim();
  }

  // Extract education section
  const educationRegex = /(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC QUALIFICATIONS|EDUCATIONAL BACKGROUND)[:\s]*\n+([\s\S]*?)(?=\n\s*\n\s*(?:EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|ACTIVITIES|VOLUNTEER|REFERENCES|ADDITIONAL)[A-Z\s]*[:\s]*\n|\Z)/i;
  const educationMatch = text.match(educationRegex);
  if (educationMatch && educationMatch[1]) {
    result.education = educationMatch[1].trim();
  }

  // Extract certifications section
  const certificationsRegex = /(?:CERTIFICATIONS|CERTIFICATES|PROFESSIONAL CERTIFICATIONS|ACCREDITATIONS)[:\s]*\n+([\s\S]*?)(?=\n\s*\n\s*(?:EDUCATION|EXPERIENCE|SKILLS|PROJECTS|ACHIEVEMENTS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|ACTIVITIES|VOLUNTEER|REFERENCES|ADDITIONAL)[A-Z\s]*[:\s]*\n|\Z)/i;
  const certificationsMatch = text.match(certificationsRegex);
  if (certificationsMatch && certificationsMatch[1]) {
    result.certifications = certificationsMatch[1].trim();
  }

  return result;
}

/**
 * Extract text content from a resume file (currently supporting PDF only)
 * @param file Resume file to extract text from
 * @returns Promise resolving to the extracted text and parsed sections
 */
export async function parseResume(file: File): Promise<ParsedResumeData> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    const fullText = await extractTextFromPDF(file);
    return extractSections(fullText);
  } else if (file.name.toLowerCase().endsWith('.docx')) {
    // Placeholder for future DOCX support
    throw new Error('DOCX files are not yet supported');
  } else {
    throw new Error('Unsupported file format. Please upload a PDF file.');
  }
}
