
/**
 * Name extractor for resume data
 */

/**
 * Extract name from text using enhanced patterns
 */
export const extractName = (text: string): string => {
  // Look for patterns that might indicate a name at the beginning of the resume
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try multiple approaches for name extraction
  
  // Approach 1: Look for name patterns at the beginning of the resume
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    const words = line.split(/\s+/);
    
    // Check for typical name patterns (1-3 words, not too short or long)
    if (words.length >= 1 && words.length <= 3 && line.length > 3 && line.length < 40) {
      // Check if line doesn't contain common non-name indicators
      if (!line.match(/resume|cv|curriculum|vitae|address|phone|email|@|http|www\.|[0-9]{4,}/i)) {
        return line;
      }
    }
  }
  
  // Approach 2: Look for specific name patterns
  const namePatterns = [
    /^([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})$/m,  // Capitalized first and last name
    /name:?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})/i,  // "Name:" followed by name
    /^([A-Z][A-Z\s]+)$/m,  // All caps name
    // More aggressive pattern to find names anywhere in text
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})(?=\s*\n|$|\s*,)/m,  // Name followed by newline, comma or end
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Normalize case (if all uppercase)
      const name = match[1].replace(/([A-Z])([A-Z]+)/g, (_, first, rest) => first + rest.toLowerCase());
      return name.trim();
    }
  }
  
  // Approach 3: Try to find contact info section and extract name
  const contactSectionPattern = /contact information|personal details|personal information/i;
  const contactSection = text.split('\n').findIndex(line => contactSectionPattern.test(line));
  
  if (contactSection !== -1) {
    // Check next few lines for a name
    for (let i = contactSection + 1; i < Math.min(contactSection + 5, lines.length); i++) {
      const line = lines[i].trim();
      const words = line.split(/\s+/);
      
      // Check for name pattern (2-3 words, properly capitalized)
      if (words.length >= 2 && words.length <= 3 && 
          words.every(word => /^[A-Z][a-z]+$/.test(word))) {
        return line;
      }
    }
  }
  
  return 'Unknown Name';
};
