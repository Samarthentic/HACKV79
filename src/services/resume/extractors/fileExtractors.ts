
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
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract text from a PDF file using a simple text extraction approach
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // This is a simplified approach that works with text-based PDFs
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const content = textDecoder.decode(arrayBuffer);
    
    // Extract text content by looking for text patterns in the PDF
    // This is a simple implementation and won't work for all PDFs
    let extractedText = '';
    
    // Look for text content between common PDF text markers
    const textMatches = content.match(/\(\(([^\)]+)\)\)/g) || [];
    textMatches.forEach(match => {
      extractedText += match.replace(/\(\(|\)\)/g, '') + ' ';
    });
    
    // If we couldn't extract text with the pattern approach, return a portion of the content
    if (extractedText.trim().length < 100) {
      // Get readable text by filtering for printable ASCII characters
      extractedText = content
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    console.log(`Extracted ${extractedText.length} characters from PDF`);
    return extractedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from a DOCX file using a simple approach
 * This is limited but doesn't require external dependencies
 */
export const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const content = await extractTextFromDocxBuffer(arrayBuffer);
    console.log(`Extracted ${content.length} characters from DOCX`);
    return content;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from a DOCX buffer
 * DOCX files are ZIP archives with XML content
 */
const extractTextFromDocxBuffer = async (buffer: ArrayBuffer): Promise<string> => {
  // This is a simplified approach that tries to extract some text
  // It doesn't properly parse DOCX structure but might extract readable content
  const textDecoder = new TextDecoder('utf-8');
  const content = textDecoder.decode(buffer);
  
  // Look for content in XML tags that might contain document text
  let extractedText = '';
  
  // Try to find paragraphs and text runs in the XML
  const paragraphMatches = content.match(/<w:p[^>]*>.*?<\/w:p>/g) || [];
  paragraphMatches.forEach(paragraph => {
    // Extract text runs from paragraphs
    const textRuns = paragraph.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
    textRuns.forEach(textRun => {
      const text = textRun.replace(/<[^>]+>/g, '');
      extractedText += text + ' ';
    });
    extractedText += '\n';
  });
  
  // If we couldn't extract text with XML parsing, try a simpler approach
  if (extractedText.trim().length < 100) {
    // Get readable text by filtering for printable ASCII characters
    extractedText = content
      .replace(/<[^>]+>/g, ' ')  // Remove XML tags
      .replace(/[^\x20-\x7E]/g, ' ')  // Keep only printable ASCII
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
  } else {
    return 'unknown';
  }
};
