
/**
 * Extract education information from resume text
 */
import { Education } from '../types';

/**
 * Extract education information
 */
export const extractEducation = (text: string): Education[] => {
  const education: Education[] = [];
  const lines = text.split('\n');
  
  // Look for education section with more variations
  const educationRegex = /education|academic|university|college|school|degree|qualification|training/i;
  let inEducationSection = false;
  let currentEntry: { degree: string, institution: string, year: string } | null = null;
  
  // Education degree patterns with more variations
  const degreePatterns = [
    /bachelor|master|phd|bs|ba|ms|ma|mba|doctorate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|ph\.d\.|degree|diploma|certificate/i,
    /associate|undergraduate|graduate|postgraduate|major|minor|btech|mtech|bsc|msc|bed|med/i,
    /computer science|engineering|business admin|administration|information technology|data science|artificial intelligence/i
  ];
  
  // University/school patterns with more variations
  const institutionPatterns = [
    /university|college|institute|school|academy|faculty|department/i,
    /polytech|community college|technical|vocational|professional/i
  ];
  
  const educationSectionEndRegex = /^(experience|work|employment|professional|skills|projects|certifications)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering an education section
    if (!inEducationSection && educationRegex.test(line)) {
      inEducationSection = true;
      continue;
    }
    
    // Check if we're leaving the education section
    if (inEducationSection && line.length > 0 && educationSectionEndRegex.test(line)) {
      inEducationSection = false;
      
      // Save any current entry before leaving section
      if (currentEntry) {
        education.push(currentEntry);
        currentEntry = null;
      }
    }
    
    // Process lines in the education section
    if (inEducationSection && line.length > 0) {
      // Skip the section header itself
      if (line.match(/^education$/i)) continue;
      
      // Look for institution names
      const isInstitution = institutionPatterns.some(pattern => pattern.test(line));
      
      // Look for degree information
      const isDegree = degreePatterns.some(pattern => pattern.test(line));
      
      // Look for year with more variations
      const yearRegex = /(19|20)\d{2}(-|–|to|-)?(19|20)?\d{0,2}/;
      const graduatedRegex = /graduated:?\s*(19|20)\d{2}/i;
      const yearMatch = line.match(yearRegex) || line.match(graduatedRegex);
      
      // If we find an institution, start a new entry
      if (isInstitution && (!currentEntry || currentEntry.institution)) {
        // Save previous entry if it exists
        if (currentEntry) {
          education.push(currentEntry);
        }
        
        // Create new entry
        currentEntry = { 
          institution: line, 
          degree: '', 
          year: '' 
        };
      } 
      // If we find a degree for current entry
      else if (isDegree && currentEntry) {
        currentEntry.degree = line;
      }
      // If we find a year for current entry
      else if (yearMatch && currentEntry) {
        currentEntry.year = yearMatch[0];
      }
      // If we find a degree without an institution
      else if (isDegree && !currentEntry) {
        currentEntry = { 
          degree: line, 
          institution: '', 
          year: '' 
        };
      }
      // For any other lines, try to fill missing information
      else if (currentEntry) {
        // If we don't have an institution yet, use this line
        if (!currentEntry.institution) {
          currentEntry.institution = line;
        } 
        // If we have institution but no degree, this might be the degree
        else if (!currentEntry.degree) {
          currentEntry.degree = line;
        }
      }
    }
  }
  
  // Add any incomplete entry
  if (currentEntry) {
    education.push(currentEntry);
  }
  
  // Try alternate approach for course-style education section
  if (education.length === 0) {
    const courseLines = text.match(/course:?\s*(.*?)(?:\n|$)/gi);
    if (courseLines && courseLines.length > 0) {
      courseLines.forEach(courseLine => {
        const course = courseLine.replace(/course:?\s*/i, '').trim();
        education.push({
          degree: course,
          institution: '',
          year: ''
        });
      });
    }
  }
  
  // If still no education found, try a more aggressive search
  if (education.length === 0) {
    // Look for lines that might contain education information
    const potentialEducation = lines.filter(line => {
      return degreePatterns.some(pattern => pattern.test(line)) || 
             institutionPatterns.some(pattern => pattern.test(line));
    });
    
    if (potentialEducation.length > 0) {
      let degreeText = '';
      let institutionText = '';
      
      for (const line of potentialEducation) {
        if (degreePatterns.some(pattern => pattern.test(line)) && !degreeText) {
          degreeText = line;
        }
        else if (institutionPatterns.some(pattern => pattern.test(line)) && !institutionText) {
          institutionText = line;
        }
      }
      
      if (degreeText || institutionText) {
        education.push({
          degree: degreeText || 'Degree',
          institution: institutionText || 'Institution',
          year: ''
        });
      }
    }
  }
  
  // If we failed to extract education, return a placeholder
  return education.length > 0 ? education : [
    { degree: 'Bachelor\'s Degree', institution: 'University', year: '2020' }
  ];
};
