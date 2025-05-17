
/**
 * Extract certifications information from resume text
 */
import { Certification } from '../types';

/**
 * Extract certifications
 */
export const extractCertifications = (text: string): Certification[] => {
  const certifications: Certification[] = [];
  const lines = text.split('\n');
  
  // Look for certifications section with more variations
  const certRegex = /certifications|certificates|qualifications|credentials|licenses|accreditations|professional development|training/i;
  let inCertSection = false;
  let currentEntry: { name: string, issuer: string, year: string } | null = null;
  
  const certSectionEndRegex = /^(education|experience|work|skills|projects|interests|activities|references)/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a certifications section
    if (!inCertSection && certRegex.test(line)) {
      inCertSection = true;
      continue;
    }
    
    // Check if we're leaving the certifications section
    if (inCertSection && line.length > 0 && certSectionEndRegex.test(line)) {
      // Save any current entry before leaving section
      if (currentEntry) {
        certifications.push(currentEntry);
        currentEntry = null;
      }
      inCertSection = false;
    }
    
    // Process lines in the certifications section
    if (inCertSection && line.length > 0) {
      // Skip the section header itself
      if (line.match(/^certifications$/i)) continue;
      
      // Look for certification patterns with more variations
      const certMatch = line.match(/certification|certificate|certified|exam|credential|license|accreditation|awarded|earned/i);
      
      // Look for year patterns with more variations
      const yearRegex = /(19|20)\d{2}/;
      const issueDateRegex = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (19|20)\d{2}/i;
      const yearMatch = line.match(yearRegex) || line.match(issueDateRegex);
      
      // Start new entry if certification pattern found or line might be a certification
      if (certMatch || 
          (line.length > 0 && line.length < 100 && 
          line !== 'Certifications' && 
          !line.endsWith(':') && 
          !line.match(/^(earned|received|completed)/i))) {
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
          if (nextLine.length > 0 && nextLine.length < 50 && 
              !certRegex.test(nextLine) && 
              !nextLine.match(/certification|certificate|certified|exam|credential|license|accreditation/i)) {
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
    const nameWithIssuer = cert.name.match(/(.+?)(?:\s+by\s+|\s+from\s+|\s+-\s+|\s+\|\s+|\s+issued by\s+|\s+awarded by\s+)(.+)/i);
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
    
    // If issuer contains year and we don't have a year yet
    if (!cert.year && cert.issuer) {
      const yearInIssuer = cert.issuer.match(/(19|20)\d{2}/);
      if (yearInIssuer) {
        cert.year = yearInIssuer[0];
        // Remove year from issuer
        cert.issuer = cert.issuer.replace(yearInIssuer[0], '').replace(/\s{2,}/g, ' ').trim();
      }
    }
    
    // If we still don't have an issuer, look for common certification providers
    if (!cert.issuer) {
      const commonIssuers = [
        'AWS', 'Amazon', 'Microsoft', 'Google', 'Oracle', 'Cisco', 'CompTIA', 
        'PMI', 'Scrum Alliance', 'Salesforce', 'Adobe', 'Apple', 'IBM', 'SAP', 
        'Red Hat', 'Linux Foundation', 'HubSpot', 'Coursera', 'Udemy', 'edX'
      ];
      
      for (const issuer of commonIssuers) {
        if (cert.name.includes(issuer)) {
          // Found a potential issuer in the name
          cert.issuer = issuer;
          cert.name = cert.name.replace(issuer, '').replace(/\s{2,}/g, ' ').trim();
          break;
        }
      }
    }
  });
  
  return certifications;
};
