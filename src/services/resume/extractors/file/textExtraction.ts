/**
 * Core text extraction functionality for different file types
 */
import { extractTextFromPDF } from './pdfExtractor';
import { extractTextFromDOCX } from './docxExtractor';
import { extractTextFromPlainText } from './plainTextExtractor';

/**
 * Extracts text content from a file based on its type
 * @param file The file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  try {
    console.log(`Starting text extraction for file: ${file.name} (${file.type})`);
    
    const fileType = getFileType(file);
    console.log(`Detected file type: ${fileType}`);
    
    let textContent = '';
    
    switch (fileType) {
      case 'pdf':
        console.log('Extracting text from PDF...');
        textContent = await extractTextFromPDF(file);
        break;
      case 'docx':
        console.log('Extracting text from DOCX...');
        textContent = await extractTextFromDOCX(file);
        break;
      case 'txt':
        console.log('Extracting text from plain text...');
        textContent = await extractTextFromPlainText(file);
        break;
      default:
        console.warn(`Unsupported file type: ${fileType}`);
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    console.log(`Text extraction complete. Extracted ${textContent.length} characters`);
    return textContent;
  } catch (error) {
    console.error('Error in extractTextFromFile:', error);
    // Return a minimal valid string so processing can continue with template data
    return '';
  }
};

/**
 * Determine file type based on extension and mime type
 */
export const getFileType = (file: File): string => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    return 'pdf';
  } else if (fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  } else if (fileName.endsWith('.doc') || file.type === 'application/msword') {
    return 'docx'; // We'll try to process .doc files as .docx
  } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
    return 'txt';
  } else if (fileName.endsWith('.rtf') || file.type === 'application/rtf') {
    return 'rtf';
  } else {
    return 'unknown';
  }
};
