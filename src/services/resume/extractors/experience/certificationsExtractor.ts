
/**
 * Extract certifications information from resume text
 */

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
