
/**
 * Plain text file extraction functionality (TXT, RTF)
 */
import { preprocessExtractedText } from './textPreprocessing';

/**
 * Extract text from plain text files (TXT, RTF)
 */
export const extractTextFromPlainText = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    const processedText = preprocessExtractedText(text);
    console.log(`Extracted ${processedText.length} characters from plain text file`);
    return processedText;
  } catch (error) {
    console.error('Plain text extraction error:', error);
    throw new Error('Failed to extract text from plain text file');
  }
};
