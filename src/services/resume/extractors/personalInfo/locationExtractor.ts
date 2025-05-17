
/**
 * Location extractor for resume data
 */

/**
 * Extract location from text with enhanced patterns
 */
export const extractLocation = (text: string): string => {
  // Enhanced location pattern matching
  
  // Look for explicit location labels
  const labeledLocationPatterns = [
    /(?:address|location|based in|living in|located in)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
    /(?:city|town|state|province|region)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
    /(?:residence|residing in|resides in)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
  ];
  
  for (const pattern of labeledLocationPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      return match[1].trim();
    }
  }
  
  // Try to find city, state pattern (common in US resumes)
  const cityStatePatterns = [
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/g,  // City, ST
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*)\s+([A-Z]{2})\s+\d{5}/g,  // City ST ZIP
  ];
  
  for (const pattern of cityStatePatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      const [, city, state] = matches[0];
      return `${city}, ${state}`;
    }
  }
  
  // Look for postal/zip code patterns with cities
  const postalPatterns = [
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),?(?:\s+[A-Z]{2})?\s+(\d{5}(-\d{4})?)/g,  // City, ZIP or City ZIP
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),?(?:\s+[A-Z]{2})?\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)/g,  // Canadian postal code
  ];
  
  for (const pattern of postalPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      const [, city, postal] = matches[0];
      return `${city} ${postal}`;
    }
  }
  
  // Look for single city name with proper capitalization near contact info
  const contactLines = text.split('\n').slice(0, 20);  // Check first 20 lines
  for (const line of contactLines) {
    // Look for standalone city names (capitalized words)
    if (/^[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*$/.test(line.trim()) && 
        !line.trim().match(/resume|cv|name|education|experience|skills/i)) {
      return line.trim();
    }
  }
  
  return '';
};
