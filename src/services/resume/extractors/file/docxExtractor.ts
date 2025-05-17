
/**
 * DOCX-specific text extraction functionality
 */
import { preprocessExtractedText } from './textPreprocessing';

/**
 * Extract text from a DOCX file using XML parsing
 */
export const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Improved DOCX extraction with better XML pattern matching
    const textContent = await extractTextFromDocxBuffer(arrayBuffer);
    
    // Process extracted text to improve quality
    const processedText = preprocessExtractedText(textContent);
    
    console.log(`Extracted ${processedText.length} characters from DOCX`);
    return processedText;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from a DOCX buffer
 * DOCX files are ZIP archives with XML content
 */
export const extractTextFromDocxBuffer = async (buffer: ArrayBuffer): Promise<string> => {
  // Enhanced DOCX parsing
  const textDecoder = new TextDecoder('utf-8');
  const content = textDecoder.decode(buffer);
  
  let extractedText = '';
  
  // Try multiple XML pattern approaches for better coverage
  const xmlPatterns = [
    // Standard DOCX text run pattern
    {
      paragraph: /<w:p[^>]*>.*?<\/w:p>/g,
      textRun: /<w:t[^>]*>(.*?)<\/w:t>/g
    },
    // Alternative XML patterns
    {
      paragraph: /<p\s[^>]*>.*?<\/p>/g,
      textRun: /<t[^>]*>(.*?)<\/t>/g
    },
    // More generic pattern
    {
      paragraph: /<para[^>]*>.*?<\/para>/g,
      textRun: /<text[^>]*>(.*?)<\/text>/g
    }
  ];
  
  for (const pattern of xmlPatterns) {
    const paragraphMatches = content.match(pattern.paragraph) || [];
    if (paragraphMatches.length > 0) {
      paragraphMatches.forEach(paragraph => {
        // Extract text runs from paragraphs
        const textRuns = paragraph.match(pattern.textRun) || [];
        textRuns.forEach(textRun => {
          const text = textRun.replace(/<[^>]+>/g, '');
          if (text.trim()) extractedText += text + ' ';
        });
        extractedText += '\n';
      });
    }
  }
  
  // If XML parsing didn't yield enough text, try a simpler approach
  if (extractedText.trim().length < 100) {
    // Get readable text by filtering for printable ASCII characters
    extractedText = content
      .replace(/<[^>]+>/g, ' ')  // Remove XML tags
      .replace(/[^\x20-\x7E\n]/g, ' ')  // Keep only printable ASCII
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
  }
  
  return extractedText;
};
