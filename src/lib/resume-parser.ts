
import * as pdfjs from 'pdfjs-dist';
import { toast } from "@/hooks/use-toast";

// Set the PDF.js worker source
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Parse PDF file
export async function parsePDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    toast({
      title: "PDF Parsing Error",
      description: "Could not extract text from your PDF. Please try another file.",
      variant: "destructive",
    });
    throw error;
  }
}

// Parse DOCX file
export async function parseDocx(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use mammoth.js to extract text from DOCX
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    toast({
      title: "DOCX Parsing Error",
      description: "Could not extract text from your DOCX file. Please try another file.",
      variant: "destructive",
    });
    throw error;
  }
}

// Main parse function that handles different file types
export async function parseResume(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'pdf') {
    return parsePDF(file);
  } else if (fileType === 'docx') {
    return parseDocx(file);
  } else {
    toast({
      title: "Unsupported File",
      description: "Please upload a PDF or DOCX file.",
      variant: "destructive",
    });
    throw new Error('Unsupported file type. Please upload PDF or DOCX.');
  }
}
