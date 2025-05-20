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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      let prevY: number | null = null;
      let pageText = '';

      textContent.items.forEach((item: any) => {
        const str = item.str as string;
        const transform = item.transform as number[];
        const y = transform[5]; // y position

        // Insert a newline when the y-position decreases (new line) or when PDF.js indicates end of line
        if (prevY !== null && Math.abs(prevY - y) > 2) {
          pageText += '\n';
        }

        pageText += str + ' ';
        if (item.hasEOL) {
          pageText += '\n';
        }
        prevY = y;
      });

      fullText += pageText + '\n';
    }

    return fullText.trim();
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
 * Helper: scan lines to grab all text between a heading match and next heading.
 */
function collectSection(lines: string[], startIndex: number, headingMatchers: RegExp[]): { content: string; nextIndex: number } {
  const collected: string[] = [];
  let i = startIndex + 1; // skip the heading line
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (headingMatchers.some(r => r.test(line))) {
      break;
    }
    collected.push(line);
  }
  return { content: collected.join('\n').trim(), nextIndex: i };
}

/**
 * Extract specific resume sections using pattern matching + line scanning
 */
export function extractSections(text: string): ParsedResumeData {
  const result: ParsedResumeData = {
    fullText: text,
    personalInfo: {},
    skills: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
  };

  // Attempt to extract name from very first non-empty line if uppercase
  const allLines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  if (allLines.length) {
    const firstLine = allLines[0];
    if (/^[A-Z\s]+$/.test(firstLine) && firstLine.split(' ').length <= 4) {
      const titleCaseName = firstLine
        .split(' ') 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      result.personalInfo.name = titleCaseName;
    }
  }

  if (!result.personalInfo.name) {
    const nameMatch = text.match(/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+/m);
    if (nameMatch) {
      result.personalInfo.name = nameMatch[0].trim();
    }
  }

  // Extract personal information
  // Email extraction
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  // Phone extraction - look for common phone number formats
  const phoneMatch = text.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];

  // Updated Location extraction - start-of-line and city,state pattern without name
  const locationMatch = text.match(/(?:^|\n)\s*([A-Za-z .'-]+,\s*[A-Z]{2})(?=\b)/);
  if (locationMatch) result.personalInfo.location = locationMatch[1];

  // LinkedIn URL extraction
  const linkedinMatch = text.match(/linkedin\.com\/in\/[A-Za-z0-9_-]+/);
  if (linkedinMatch) result.personalInfo.linkedin = `https://${linkedinMatch[0]}`;

  // GitHub URL extraction
  const githubMatch = text.match(/github\.com\/[A-Za-z0-9_-]+/);
  if (githubMatch) result.personalInfo.github = `https://${githubMatch[0]}`;

  // Build line array for section scanning
  const headingMap: { key: keyof ParsedResumeData; patterns: RegExp[] }[] = [
    {
      key: 'skills',
      patterns: [/^SKILLS\b.*$/i, /^TECHNICAL SKILLS\b.*$/i, /^CORE COMPETENCIES\b.*$/i, /^TECHNOLOGIES\b.*$/i],
    },
    {
      key: 'experience',
      patterns: [/^WORK EXPERIENCE\b.*$/i, /^EXPERIENCE\b.*$/i, /^PROFESSIONAL EXPERIENCE\b.*$/i, /^EMPLOYMENT HISTORY\b.*$/i],
    },
    {
      key: 'projects',
      patterns: [/^PROJECTS\b.*$/i, /^PROJECTS & RESEARCH\b.*$/i, /^NOTABLE PROJECTS\b.*$/i, /^PERSONAL PROJECTS\b.*$/i],
    },
    {
      key: 'education',
      patterns: [/^EDUCATION$/i],
    },
    {
      key: 'certifications',
      patterns: [/^CERTIFICATIONS$/i, /^CERTIFICATES$/i],
    },
  ];

  // Precompute all headings regex list to use as stop markers
  const stopMatchers = headingMap.flatMap(h => h.patterns);

  // Scan lines
  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i];
    for (const h of headingMap) {
      if (h.patterns.some(r => r.test(line))) {
        const { content, nextIndex } = collectSection(allLines, i, stopMatchers);
        if (content && !result[h.key]) {
          result[h.key] = content;
        }
        i = nextIndex - 1;
        break;
      }
    }
  }

  // Post-process skills to merge lines and remove sub-labels
  if (result.skills) {
    result.skills = result.skills
      .replace(/^(?:Tools & Technologies|Programming Languages)[:\s]*/gim, '')
      .replace(/\n+/g, ', ')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+,/g, ',')
      .replace(/,\s+/g, ', ')
      .trim();
  }

  // If location not found, try to get first city, state in top 10 lines
  if (!result.personalInfo.location) {
    for (let i = 0; i < Math.min(10, allLines.length); i++) {
      const m = allLines[i].match(/([A-Za-z .'-]+,\s*[A-Z]{2})(?=\b)/);
      if (m) {
        result.personalInfo.location = m[1];
        break;
      }
    }
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
