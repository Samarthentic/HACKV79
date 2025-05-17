
/**
 * Enhanced text preprocessing for resume content
 * Improves text quality for better extraction results
 */

/**
 * Preprocess extracted text to improve quality
 * @param text Raw text content
 * @returns Processed text
 */
export const preprocessExtractedText = (text: string): string => {
  if (!text) return '';
  
  console.log("Starting text preprocessing...");
  
  // Remove excess whitespace
  let processed = text.replace(/\s+/g, ' ').trim();
  
  // Fix common OCR errors
  processed = processed
    .replace(/[''`]/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\r\n|\r/g, '\n');
  
  // Normalize line breaks
  processed = processed.replace(/\n{3,}/g, '\n\n');
  
  console.log("Text preprocessing complete.");
  return processed;
};

/**
 * Extract sections from resume text
 * @param text Resume text content
 * @returns Object with sections as properties
 */
export const extractSections = (text: string): Record<string, string> => {
  if (!text) return {
    header: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    certifications: '',
    references: '',
    other: ''
  };
  
  console.log("Extracting resume sections...");
  
  const sections: Record<string, string> = {
    header: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    certifications: '',
    references: '',
    other: ''
  };
  
  // Extract header (usually first few lines)
  const lines = text.split('\n');
  sections.header = lines.slice(0, Math.min(6, lines.length)).join('\n');
  
  // Find common section headers
  const sectionPatterns = [
    { name: 'summary', patterns: [/\b(summary|profile|objective|about me)\b/i] },
    { name: 'experience', patterns: [/\b(experience|work experience|employment|work history|professional experience)\b/i] },
    { name: 'education', patterns: [/\b(education|academic|qualifications|degrees)\b/i] },
    { name: 'skills', patterns: [/\b(skills|technical skills|core competencies|expertise|qualifications|proficiencies)\b/i] },
    { name: 'certifications', patterns: [/\b(certifications|certificates|accreditations|licenses)\b/i] },
    { name: 'references', patterns: [/\b(references|referees)\b/i] }
  ];
  
  // Try to locate sections using common patterns
  let currentSection = 'other';
  let currentContent: string[] = [];
  
  lines.forEach(line => {
    // Check if this line is a section header
    let isSectionHeader = false;
    
    for (const section of sectionPatterns) {
      if (section.patterns.some(pattern => pattern.test(line))) {
        // Save previous section content
        if (currentContent.length > 0) {
          sections[currentSection] += currentContent.join('\n');
          currentContent = [];
        }
        
        // Set new current section
        currentSection = section.name;
        isSectionHeader = true;
        break;
      }
    }
    
    if (!isSectionHeader) {
      currentContent.push(line);
    }
  });
  
  // Add content of last section
  if (currentContent.length > 0) {
    sections[currentSection] += currentContent.join('\n');
  }
  
  // Log result and return
  console.log("Sections extracted:", Object.keys(sections).map(k => `${k}: ${sections[k].length} chars`));
  return sections;
};
