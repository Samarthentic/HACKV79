
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
    // Improve extraction with context patterns
    /contact[:\s]*(.*?)[\w.+-]+@[\w-]+\.[\w.-]+/gi, // Email in contact section
    /personal[:\s]*(.*?)[\w.+-]+@[\w-]+\.[\w.-]+/gi, // Email in personal section
  ];
  
  for (const pattern of emailPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // For patterns with capturing groups, extract the group
      if (pattern.toString().includes('(')) {
        const match = pattern.exec(text);
        if (match && match[1]) {
          // Clean up the email (remove any trailing punctuation)
          let email = match[1].replace(/[,;:\s]$/, '').trim();
          // Ensure it's a valid-looking email
          if (email.includes('@') && email.includes('.')) {
            return email;
          }
        }
      } else {
        // Clean up the extracted email
        let email = matches[0].trim();
        if (email.includes('@') && email.includes('.')) {
          return email;
        }
      }
    }
  }
  
  // Look for email patterns in specific sections
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.toLowerCase().includes('email') || line.toLowerCase().includes('e-mail') || 
        line.toLowerCase().includes('contact') || line.toLowerCase().includes('@')) {
      // Extract anything that looks like an email
      const emailMatch = line.match(/[\w.+-]+@[\w-]+\.[\w.-]+/gi);
      if (emailMatch && emailMatch.length > 0) {
        return emailMatch[0].trim();
      }
    }
  }
  
  return '';
};
