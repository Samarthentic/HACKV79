
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

/**
 * Preprocess extracted text to improve quality and consistency
 */
export const preprocessExtractedText = (text: string): string => {
  let processed = text
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Fix common extraction errors
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/–/g, '-')
    .trim();
    
  // Improve section detection by adding newlines
  processed = processed
    // Add newlines after periods followed by capital letters (likely new sentences)
    .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
    // Replace multiple newlines with a single one
    .replace(/(\n\s*)+/g, '\n')
    // Add newlines before likely section headers
    .replace(/([A-Z][A-Z\s]{3,}:)/g, '\n$1')
    // Add newlines before common section headers
    .replace(/\s+(EDUCATION|EXPERIENCE|SKILLS|WORK HISTORY|CERTIFICATIONS|ACHIEVEMENTS)(\s+|:)/gi, '\n$1$2');
  
  return processed;
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
