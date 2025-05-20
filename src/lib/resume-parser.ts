
import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source
const pdfjsWorkerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerSrc;

export const parsePdfResume = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF resume');
  }
};

export const parseDocxResume = async (file: File): Promise<string> => {
  // In a real application, you'd use a library like mammoth.js to parse DOCX
  // For this example, we'll just return a placeholder
  console.log('DOCX parsing would happen here');
  return 'DOCX resume content would be extracted here';
};

export const parseResume = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return parsePdfResume(file);
  } else if (file.name.endsWith('.docx')) {
    return parseDocxResume(file);
  }
  throw new Error('Unsupported file format');
};
