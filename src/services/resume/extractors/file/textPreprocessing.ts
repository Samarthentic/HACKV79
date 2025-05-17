
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
    // Add newlines before common section headers with more variations
    .replace(/\s+(EDUCATION|EXPERIENCE|SKILLS|WORK HISTORY|CERTIFICATIONS|ACHIEVEMENTS|PROFESSIONAL SUMMARY|OBJECTIVE|QUALIFICATIONS|TRAINING|HONORS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|VOLUNTEER|AFFILIATIONS)(\s+|:)/gi, '\n$1$2')
    // Add newlines before capitalized sections that are likely headers
    .replace(/([^.\n])\s+([A-Z][A-Za-z\s]{2,}:)/g, '$1\n$2');
  
  // Ensure proper spacing between sections
  processed = processed
    // Add extra newline before key resume sections to ensure clear separation
    .replace(/\n(Education|Experience|Skills|Work History|Professional Experience|Certifications|Achievements)/gi, '\n\n$1')
    // Format bullet points consistently
    .replace(/([•\*\-])\s*/g, '\n• ');
  
  return processed;
};
