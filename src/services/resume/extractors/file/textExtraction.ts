
/**
 * Core text extraction functionality for different file types
 */
import { extractTextFromPDF } from './pdfExtractor';
import { extractTextFromDOCX } from './docxExtractor';
import { extractTextFromPlainText } from './plainTextExtractor';

/**
 * Extract text content from a file based on its type
 * @param file The file to extract text from
 * @returns Promise with the extracted text
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = getFileType(file);
  
  console.log(`Extracting text from ${file.name} (${fileType})`);
  
  try {
    if (fileType === 'pdf') {
      return await extractTextFromPDF(file);
    } else if (fileType === 'docx') {
      return await extractTextFromDOCX(file);
    } else if (fileType === 'txt' || fileType === 'rtf') {
      return await extractTextFromPlainText(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
