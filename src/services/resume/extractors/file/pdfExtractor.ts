
/**
 * PDF-specific text extraction functionality
 */
import { preprocessExtractedText } from './textPreprocessing';

/**
 * Extract text from a PDF file using pattern matching
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Advanced PDF text extraction using ArrayBuffer and pattern matching
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const content = textDecoder.decode(arrayBuffer);
    
    // Enhanced PDF text extraction with multiple patterns
    let extractedText = '';
    
    // Multiple pattern approaches for better text extraction coverage
    const patterns = [
      // PDF text object markers
      /\(\(([^\)]+)\)\)/g,          // Common text pattern
      /\(([^\(\)]{2,})\)/g,         // Text in parentheses
      /\/Text[^\/]*\/([^\/\[]+)/g,  // Text after /Text marker
      /<text[^>]*>(.*?)<\/text>/gi, // XML-like text tags
      
      // Object streams (extract readable content)
      /stream\s([\s\S]*?)\sendstream/g,
      
      // Content streams
      /BT\s([\s\S]*?)\sET/g,        // Text blocks
      
      // Font references and content
      /\/F\d+\s+\d+\s+Tf\s*([\(\)]*.*?)[><\]]/g
    ];
    
    // Try all patterns to maximize text extraction
    for (const pattern of patterns) {
      const matches = content.match(pattern) || [];
      matches.forEach(match => {
        // Clean up pattern-specific markers
        const cleaned = match.replace(/\(\(|\)\)|\(|\)|\/Text|<text[^>]*>|<\/text>|stream|endstream|BT|ET|\/F\d+\s+\d+\s+Tf/gi, '');
        if (cleaned.trim()) extractedText += cleaned + ' ';
      });
    }
    
    // If patterns didn't work well, try general content filtering
    if (extractedText.trim().length < 100) {
      // Get readable text by filtering for printable ASCII characters
      extractedText = content
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    // Process extracted text to improve quality
    extractedText = preprocessExtractedText(extractedText);
    
    console.log(`Extracted ${extractedText.length} characters from PDF`);
    return extractedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
