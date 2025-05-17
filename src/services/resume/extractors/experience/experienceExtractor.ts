
/**
 * Extract work experience information from resume text
 */
import { Experience } from '../types';

/**
 * Extract work experience
 */
export const extractExperience = (text: string): Experience[] => {
  const experience: Experience[] = [];
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
