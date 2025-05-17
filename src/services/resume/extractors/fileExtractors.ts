
/**
 * Text extractors for different file types
 */

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
 * Extract text from a PDF file using pattern matching
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // This is a simplified approach that works with text-based PDFs
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const content = textDecoder.decode(arrayBuffer);
    
    // Enhanced text extraction for PDFs
    let extractedText = '';
    
    // Try multiple pattern approaches for better coverage
    // Look for text content between common PDF text markers
    const textMarkerPatterns = [
      /\(\(([^\)]+)\)\)/g,          // Common text marker pattern
      /\(([^\(\)]{2,})\)/g,         // Text in parentheses
      /\/Text[^\/]*\/([^\/\[]+)/g,  // Text after /Text marker
      /<text[^>]*>(.*?)<\/text>/gi, // XML-like text tags (some PDFs)
    ];
    
    for (const pattern of textMarkerPatterns) {
      const matches = content.match(pattern) || [];
      if (matches.length > 0) {
        matches.forEach(match => {
          const cleaned = match.replace(/\(\(|\)\)|\(|\)|\/Text|<text[^>]*>|<\/text>/gi, '');
          if (cleaned.trim()) extractedText += cleaned + ' ';
        });
      }
    }
    
    // If pattern-based extraction didn't yield enough text, try character filtering
    if (extractedText.trim().length < 100) {
      // Get readable text by filtering for printable ASCII characters
      extractedText = content
        .replace(/[^\x20-\x7E\n]/g, ' ') // Keep newlines for structure
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

/**
 * Extract text from a DOCX file using XML parsing
 */
export const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const content = await extractTextFromDocxBuffer(arrayBuffer);
    
    // Process extracted text to improve quality
    const processedText = preprocessExtractedText(content);
    
    console.log(`Extracted ${processedText.length} characters from DOCX`);
    return processedText;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * New function to extract text from plain text files (TXT, RTF)
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

/**
 * Preprocess extracted text to improve quality and consistency
 */
export const preprocessExtractedText = (text: string): string => {
  return text
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Fix common OCR/extraction errors
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/–/g, '-')
    // Break text into sections based on newlines for better section detection
    .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
    .replace(/(\n\s*)+/g, '\n')
    .trim();
};

/**
 * Extract text from a DOCX buffer
 * DOCX files are ZIP archives with XML content
 */
const extractTextFromDocxBuffer = async (buffer: ArrayBuffer): Promise<string> => {
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

/**
 * Determine file type based on extension and mime type
 * Enhanced to support more file formats
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
