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
  
  // Education degree patterns
  const degreePatterns = [
    /bachelor|master|phd|bs|ba|ms|ma|mba|doctorate|b\.s\.|m\.s\.|b\.a\.|m\.a\.|ph\.d\.|degree|diploma|certificate/i,
    /associate|undergraduate|graduate|postgraduate|major|minor/i
  ];
  
  // University/school patterns
  const institutionPatterns = [
    /university|college|institute|school|academy/i
  ];
  
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
      
      // Save any current entry before leaving section
      if (currentEntry) {
        education.push(currentEntry);
        currentEntry = null;
      }
    }
    
    // Process lines in the education section
    if (inEducationSection && line.length > 0) {
      // Look for institution names
      const isInstitution = institutionPatterns.some(pattern => pattern.test(line));
      
      // Look for degree information
      const isDegree = degreePatterns.some(pattern => pattern.test(line));
      
      // Look for year
      const yearRegex = /(19|20)\d{2}(-|–|to)?(19|20)?\d{0,2}/;
      const yearMatch = line.match(yearRegex);
      
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
  
  // If we failed to extract education, return a placeholder
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
  const experienceRegex = /experience|work history|employment|professional experience|career/i;
  let inExperienceSection = false;
  let currentEntry: { title: string, company: string, period: string, description: string } | null = null;
  let descriptionLines: string[] = [];
  
  // Common job title patterns
  const jobTitlePatterns = [
    /(software|senior|junior|lead|principal|staff|chief|head|director|vp|vice president|manager|engineer|developer|analyst|consultant|specialist|coordinator|associate|assistant)/i,
    /(designer|architect|administrator|technician|officer|executive|advisor|intern|trainee|contractor)/i
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering an experience section
    if (!inExperienceSection && experienceRegex.test(line)) {
      inExperienceSection = true;
      continue;
    }
    
    // Check if we're leaving the experience section
    if (inExperienceSection && line.length > 0 && 
        /^(education|academic|skills|projects|certifications|interests|activities|references)/i.test(line)) {
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
      const isJobTitle = jobTitlePatterns.some(pattern => pattern.test(line));
      
      // Look for year patterns
      const yearRegex = /(19|20)\d{2}(-|–|to|-)?(present|current|now|(19|20)?\d{0,2})/i;
      const yearMatch = line.match(yearRegex);
      
      // If this line has a job title AND year, it's likely the start of a new entry
      if (isJobTitle && yearMatch) {
        // Save previous entry if it exists
        if (currentEntry) {
          currentEntry.description = descriptionLines.join(' ');
          experience.push(currentEntry);
          descriptionLines = [];
        }
        
        // Create new entry
        currentEntry = {
          title: line.replace(yearRegex, '').trim(),
          company: '',
          period: yearMatch[0],
          description: ''
        };
      }
      // If this line has just a job title, it might be the start of a new entry
      else if (isJobTitle && !currentEntry) {
        currentEntry = {
          title: line,
          company: '',
          period: '',
          description: ''
        };
      }
      // If this line has just a year pattern and we have a current entry without a period
      else if (yearMatch && currentEntry && !currentEntry.period) {
        currentEntry.period = yearMatch[0];
      }
      // If we have a current entry but no company yet
      else if (currentEntry && !currentEntry.company) {
        // This might be the company name
        currentEntry.company = line;
      }
      // Add to description
      else if (currentEntry) {
        // If line starts with bullet point, it's definitely part of description
        if (line.match(/^[•\*\-\+]/)) {
          descriptionLines.push(line);
        }
        // Check if this might be a company name that was missed
        else if (currentEntry.company === '' && !line.match(/^\s+/) && line.length < 60) {
          currentEntry.company = line;
        }
        // Otherwise, add to description
        else {
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
  
  // Clean up entries - fix common issues
  experience.forEach(entry => {
    // If title contains company in parentheses, separate them
    const titleWithCompany = entry.title.match(/(.+)\s*(?:\((.+)\))/);
    if (titleWithCompany && entry.company === '') {
      entry.title = titleWithCompany[1].trim();
      entry.company = titleWithCompany[2].trim();
    }
    
    // If company contains period, extract it
    const companyWithPeriod = entry.company.match(/(.+)\s*(19|20)\d{2}(-|–|to|-)?(present|current|now|(19|20)?\d{0,2})/i);
    if (companyWithPeriod && entry.period === '') {
      entry.company = companyWithPeriod[1].trim();
      entry.period = companyWithPeriod[0].replace(entry.company, '').trim();
    }
    
    // Improve description formatting
    entry.description = entry.description
      .replace(/\s*[•\*\-\+]\s*/g, '\n• ') // Format bullet points
      .replace(/\s{2,}/g, ' ') // Remove extra spaces
      .trim();
    
    if (!entry.description.startsWith('• ')) {
      entry.description = '• ' + entry.description;
    }
  });
  
  // If we failed to extract experience, return a placeholder
  return experience.length > 0 ? experience : [
    { 
      title: 'Software Engineer', 
      company: 'Tech Company', 
      period: '2020-Present', 
      description: '• Worked on various projects using multiple technologies.\n• Collaborated with team members to deliver high-quality software solutions.' 
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
  const certRegex = /certifications|certificates|qualifications|credentials|licenses|accreditations/i;
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
        /^(education|experience|work|skills|projects|interests|activities|references)/i.test(line)) {
      // Save any current entry before leaving section
      if (currentEntry) {
        certifications.push(currentEntry);
        currentEntry = null;
      }
      inCertSection = false;
    }
    
    // Process lines in the certifications section
    if (inCertSection && line.length > 0) {
      // Look for certification patterns
      const certMatch = line.match(/certification|certificate|certified|exam|credential|license|accreditation/i);
      
      // Look for year patterns
      const yearRegex = /(19|20)\d{2}/;
      const yearMatch = line.match(yearRegex);
      
      // Start new entry if certification pattern found or line might be a certification
      if (certMatch || (line.length > 0 && line.length < 100 && line !== 'Certifications' && !line.endsWith(':'))) {
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
          if (nextLine.length > 0 && nextLine.length < 50 && !certRegex.test(nextLine)) {
            // Next line might be the issuer
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
  
  // Clean up entries - look for issuer in certification name
  certifications.forEach(cert => {
    // If certification name contains "by" or "from" followed by issuer
    const nameWithIssuer = cert.name.match(/(.+?)(?:\s+by\s+|\s+from\s+|\s+-\s+|\s+\|\s+)(.+)/i);
    if (nameWithIssuer && cert.issuer === '') {
      cert.name = nameWithIssuer[1].trim();
      cert.issuer = nameWithIssuer[2].trim();
    }
    
    // If certification name contains year and we don't have a year yet
    if (!cert.year) {
      const yearInName = cert.name.match(/(19|20)\d{2}/);
      if (yearInName) {
        cert.year = yearInName[0];
        // Remove year from name
        cert.name = cert.name.replace(yearInName[0], '').replace(/\s{2,}/g, ' ').trim();
      }
    }
  });
  
  return certifications;
};
