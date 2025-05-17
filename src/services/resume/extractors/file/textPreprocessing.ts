
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
    // Add newlines before likely section headers (enhanced pattern matching)
    .replace(/([A-Z][A-Z\s]{2,}:)/g, '\n$1')
    // Add newlines before common section headers with more variations
    .replace(/\s+(EDUCATION|EXPERIENCE|SKILLS|WORK HISTORY|CERTIFICATIONS|ACHIEVEMENTS|PROFESSIONAL SUMMARY|OBJECTIVE|QUALIFICATIONS|TRAINING|HONORS|AWARDS|PUBLICATIONS|LANGUAGES|INTERESTS|VOLUNTEER|AFFILIATIONS)(\s+|:)/gi, '\n$1$2')
    // Add newlines before capitalized sections that are likely headers
    .replace(/([^.\n])\s+([A-Z][A-Za-z\s]{2,}:)/g, '$1\n$2');
  
  // Enhance section segmentation
  processed = processed
    // Add extra newline before key resume sections to ensure clear separation
    .replace(/\n(Education|Experience|Skills|Work History|Professional Experience|Certifications|Achievements)/gi, '\n\n$1')
    // Format bullet points consistently
    .replace(/([•\*\-])\s*/g, '\n• ');
  
  // Enhanced detection of contact information
  processed = processed
    // Ensure email addresses are on their own line
    .replace(/([^\n])([\w\.-]+@[\w\.-]+\.\w+)/g, '$1\n$2')
    // Ensure phone numbers are on their own line (various formats)
    .replace(/([^\n])((?:\+?1[\s-]?)?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g, '$1\n$2')
    // Ensure URLs are on their own line
    .replace(/([^\n])(https?:\/\/[^\s]+)/g, '$1\n$2');
  
  // Improve detection of job titles and companies
  processed = processed
    // Add spacing for date ranges to help with experience detection
    .replace(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4}\s*[-–]\s*\d{4}|\d{4}\s*[-–]\s*(?:Present|Current|Now))/gi, '\n$1\n')
    // Add line breaks before job titles (typically capitalized)
    .replace(/([^\n])(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Manager|Director|Analyst|Designer|Consultant|Specialist|Coordinator|Assistant|Associate|Lead|Head|Chief|Officer|Administrator|Supervisor|Representative)\b)/g, '$1\n$2');
    
  return processed;
};

/**
 * Extract key sections from resume text with enhanced pattern recognition
 * This helps improve the accuracy of information extraction
 */
export const extractSections = (text: string): Record<string, string> => {
  const processedText = preprocessExtractedText(text);
  const lines = processedText.split('\n');
  const sections: Record<string, string> = {
    header: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    certifications: '',
    other: ''
  };
  
  let currentSection = 'header';
  let headerEndDetected = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Detection of section headers
    if (/^(?:PROFESSIONAL\s+)?EXPERIENCE|WORK(?:\s+HISTORY)?|EMPLOYMENT/i.test(line)) {
      currentSection = 'experience';
      continue;
    } else if (/^EDUCATION|ACADEMIC/i.test(line)) {
      currentSection = 'education';
      continue;
    } else if (/^SKILLS|TECHNOLOGIES|PROFICIENCIES|EXPERTISE/i.test(line)) {
      currentSection = 'skills';
      continue;
    } else if (/^CERTIFICATIONS|CERTIFICATES|LICENSES/i.test(line)) {
      currentSection = 'certifications';
      continue;
    } else if (/^(?:PROFESSIONAL\s+)?SUMMARY|PROFILE|OBJECTIVE|ABOUT/i.test(line)) {
      currentSection = 'summary';
      continue;
    } else if (
      !headerEndDetected && 
      (line.includes('@') || 
       /^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(line.replace(/\D/g, '')) || 
       /linkedin\.com/.test(line))
    ) {
      // Still in the header section if we find contact details
      currentSection = 'header';
    } else if (!headerEndDetected && 
               currentSection === 'header' && 
               line.length > 30 && 
               !/^[A-Z\s]+$/.test(line)) {
      // Likely moved past the header into summary
      headerEndDetected = true;
      currentSection = 'summary';
    }
    
    // Add the line to the appropriate section
    sections[currentSection] += line + '\n';
  }
  
  // Clean up each section
  Object.keys(sections).forEach(key => {
    sections[key] = sections[key].trim();
  });
  
  return sections;
};
