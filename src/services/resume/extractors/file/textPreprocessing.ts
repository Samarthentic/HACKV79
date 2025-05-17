
/**
 * Text preprocessing for improving extraction quality
 */

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
