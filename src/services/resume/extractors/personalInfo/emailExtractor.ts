
/**
 * Email extractor for resume data
 */

/**
 * Extract email from text with enhanced patterns
 */
export const extractEmail = (text: string): string => {
  // Enhanced email pattern matching
  const emailPatterns = [
    /[\w.+-]+@[\w-]+\.[\w.-]+/gi,  // Standard email
    /email:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "Email:" followed by email
    /e-mail:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "E-mail:" followed by email
    /mail:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "Mail:" followed by email
    /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi, // Another email pattern
  ];
  
  for (const pattern of emailPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // For patterns with capturing groups, extract the group
      if (pattern.toString().includes('(')) {
        const match = pattern.exec(text);
        if (match && match[1]) {
          return match[1];
        }
      } else {
        return matches[0];
      }
    }
  }
  
  return '';
};
