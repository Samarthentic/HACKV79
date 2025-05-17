
/**
 * Extractors for experience and education sections
 */

/**
 * Extract education information
 */
export const extractEducation = (text: string): Array<{ degree: string, institution: string, year: string }> => {
  const education: Array<{ degree: string, institution: string, year: string }> = [];
  const lines = text.split('\n');
  
  // Look for education section
  const educationRegex = /education|academic|university|college|school/i;
  let inEducationSection = false;
  let currentEntry: { degree: string, institution: string, year: string } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering an education section
    if (!inEducationSection && educationRegex.test(line)) {
      inEducationSection = true;
      continue;
    }
    
    // Check if we're leaving the education section
    if (inEducationSection && line.length > 0 && 
        /^(experience|work|employment|professional|skills|projects)/i.test(line)) {
      inEducationSection = false;
    }
    
    // Process lines in the education section
    if (inEducationSection && line.length > 0) {
      // Look for university/college names
      if (/university|college|institute|school/i.test(line) && !currentEntry) {
        currentEntry = { degree: '', institution: line, year: '' };
      }
      
      // Look for degree information
      if (currentEntry && /bachelor|master|phd|bs|ba|ms|ma|degree|diploma/i.test(line)) {
        currentEntry.degree = line;
      }
      
      // Look for year
      const yearRegex = /(19|20)\d{2}(-|–|to)?(19|20)?\d{0,2}/;
      const yearMatch = line.match(yearRegex);
      
      if (currentEntry && yearMatch) {
        currentEntry.year = yearMatch[0];
        education.push(currentEntry);
        currentEntry = null;
      }
    }
  }
  
  // Add any incomplete entry
  if (currentEntry) {
    education.push(currentEntry);
  }
  
  return education.length > 0 ? education : [
    { degree: 'Bachelor\'s Degree', institution: 'University', year: '2020' }
  ];
};

/**
 * Extract work experience
 */
export const extractExperience = (text: string): Array<{ title: string, company: string, period: string, description: string }> => {
  const experience: Array<{ title: string, company: string, period: string, description: string }> = [];
  const lines = text.split('\n');
  
  // Look for experience section
  const experienceRegex = /experience|work history|employment|professional experience/i;
  let inExperienceSection = false;
  let currentEntry: { title: string, company: string, period: string, description: string } | null = null;
  let descriptionLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering an experience section
    if (!inExperienceSection && experienceRegex.test(line)) {
      inExperienceSection = true;
      continue;
    }
    
    // Check if we're leaving the experience section
    if (inExperienceSection && line.length > 0 && 
        /^(education|academic|skills|projects|certifications)/i.test(line)) {
      // Save any current entry before leaving section
      if (currentEntry) {
        currentEntry.description = descriptionLines.join(' ');
        experience.push(currentEntry);
        currentEntry = null;
        descriptionLines = [];
      }
      inExperienceSection = false;
    }
    
    // Process lines in the experience section
    if (inExperienceSection && line.length > 0) {
      // Look for job title patterns
      const titleRegex = /(software engineer|developer|programmer|analyst|consultant|manager|director|lead|architect|designer|administrator|specialist|coordinator)/i;
      const titleMatch = line.match(titleRegex);
      
      // Look for year patterns
      const yearRegex = /(19|20)\d{2}(-|–|to)?(present|current|now|(19|20)?\d{0,2})/i;
      const yearMatch = line.match(yearRegex);
      
      // If we find both a job title and a year, this is likely a new entry
      if ((titleMatch || /^[A-Z][\w\s]+$/.test(line)) && 
          (yearMatch || (i + 1 < lines.length && yearRegex.test(lines[i + 1])))) {
        // Save previous entry if it exists
        if (currentEntry) {
          currentEntry.description = descriptionLines.join(' ');
          experience.push(currentEntry);
          descriptionLines = [];
        }
        
        // Create new entry
        currentEntry = {
          title: titleMatch ? titleMatch[0] : line,
          company: '',
          period: yearMatch ? yearMatch[0] : '',
          description: ''
        };
        
        // Try to find company name
        if (!yearMatch && i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.length > 0 && !titleRegex.test(nextLine)) {
            currentEntry.company = nextLine;
            i++; // Skip next line since we've processed it
          }
        }
      } 
      // If we have a current entry, add lines to description
      else if (currentEntry) {
        // If line might be a company name and company is empty
        if (currentEntry.company === '' && line.length > 0 && line.length < 50) {
          currentEntry.company = line;
        } else {
          descriptionLines.push(line);
        }
      }
    }
  }
  
  // Add last entry if it exists
  if (currentEntry) {
    currentEntry.description = descriptionLines.join(' ');
    experience.push(currentEntry);
  }
  
  return experience.length > 0 ? experience : [
    { 
      title: 'Software Engineer', 
      company: 'Tech Company', 
      period: '2020-Present', 
      description: 'Worked on various projects and technologies.' 
    }
  ];
};

/**
 * Extract certifications
 */
export const extractCertifications = (text: string): Array<{ name: string, issuer: string, year: string }> => {
  const certifications: Array<{ name: string, issuer: string, year: string }> = [];
  const lines = text.split('\n');
  
  // Look for certifications section
  const certRegex = /certifications|certificates|qualifications|credentials|licenses/i;
  let inCertSection = false;
  let currentEntry: { name: string, issuer: string, year: string } | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a certifications section
    if (!inCertSection && certRegex.test(line)) {
      inCertSection = true;
      continue;
    }
    
    // Check if we're leaving the certifications section
    if (inCertSection && line.length > 0 && 
        /^(education|experience|work|skills|projects)/i.test(line)) {
      inCertSection = false;
    }
    
    // Process lines in the certifications section
    if (inCertSection && line.length > 0) {
      // Look for certification patterns
      const certMatch = line.match(/certification|certificate|certified|exam|credential/i);
      
      // Look for year patterns
      const yearRegex = /(19|20)\d{2}/;
      const yearMatch = line.match(yearRegex);
      
      if (certMatch || (line.length > 0 && line.length < 100)) {
        // Save previous entry if it exists
        if (currentEntry) {
          certifications.push(currentEntry);
        }
        
        // Create new entry
        currentEntry = {
          name: line,
          issuer: '',
          year: yearMatch ? yearMatch[0] : ''
        };
        
        // Try to find issuer on next line
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          if (nextLine.length > 0 && nextLine.length < 50) {
            currentEntry.issuer = nextLine;
            i++; // Skip next line since we've processed it
          }
        }
      }
    }
  }
  
  // Add last entry if it exists
  if (currentEntry) {
    certifications.push(currentEntry);
  }
  
  return certifications;
};
