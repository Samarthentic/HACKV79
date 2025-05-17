
/**
 * Phone number extractor for resume data
 */

/**
 * Extract phone number from text with enhanced patterns
 */
export const extractPhone = (text: string): string => {
  // Enhanced phone number pattern matching
  const phonePatterns = [
    /(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/g,  // Standard US phone
    /phone:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Phone:" followed by phone
    /mobile:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Mobile:" followed by phone
    /cell:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Cell:" followed by phone
    /tel:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Tel:" followed by phone
    // International formats
    /\+\d{1,3}[\s-]?\d{1,3}[\s-]?\d{3,5}[\s-]?\d{3,5}/g, // International format with country code
  ];
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Clean up and standardize the phone number format
      let phone = matches[0].replace(/phone:?\s*/i, '');
      
      // Format the phone number for consistency
      phone = phone.replace(/[^\d+]/g, '');
      if (phone.length === 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (phone.length === 11 && phone.startsWith('1')) {
        return phone.replace(/1(\d{3})(\d{3})(\d{4})/, '+1 $1-$2-$3');
      }
      
      return matches[0].trim();
    }
  }
  
  return '';
};
