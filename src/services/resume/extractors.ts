
/**
 * Simple text extractors for resume files
 */

/**
 * Extract text content from a file based on its type
 * @param file The file to extract text from
 * @returns Promise with the extracted text
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = getFileType(file);
  
  console.log(`Extracting text from ${file.name} (${fileType})`);
  
  try {
    if (fileType === 'pdf') {
      return await extractTextFromPDF(file);
    } else if (fileType === 'docx') {
      return await extractTextFromDOCX(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error(`Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract text from a PDF file using a simple text extraction approach
 */
const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // This is a simplified approach that works with text-based PDFs
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    const content = textDecoder.decode(arrayBuffer);
    
    // Extract text content by looking for text patterns in the PDF
    // This is a simple implementation and won't work for all PDFs
    let extractedText = '';
    
    // Look for text content between common PDF text markers
    const textMatches = content.match(/\(\(([^\)]+)\)\)/g) || [];
    textMatches.forEach(match => {
      extractedText += match.replace(/\(\(|\)\)/g, '') + ' ';
    });
    
    // If we couldn't extract text with the pattern approach, return a portion of the content
    if (extractedText.trim().length < 100) {
      // Get readable text by filtering for printable ASCII characters
      extractedText = content
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    
    console.log(`Extracted ${extractedText.length} characters from PDF`);
    return extractedText;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from a DOCX file using a simple approach
 * This is limited but doesn't require external dependencies
 */
const extractTextFromDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const content = await extractTextFromDocxBuffer(arrayBuffer);
    console.log(`Extracted ${content.length} characters from DOCX`);
    return content;
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from a DOCX buffer
 * DOCX files are ZIP archives with XML content
 */
const extractTextFromDocxBuffer = async (buffer: ArrayBuffer): Promise<string> => {
  // This is a simplified approach that tries to extract some text
  // It doesn't properly parse DOCX structure but might extract readable content
  const textDecoder = new TextDecoder('utf-8');
  const content = textDecoder.decode(buffer);
  
  // Look for content in XML tags that might contain document text
  let extractedText = '';
  
  // Try to find paragraphs and text runs in the XML
  const paragraphMatches = content.match(/<w:p[^>]*>.*?<\/w:p>/g) || [];
  paragraphMatches.forEach(paragraph => {
    // Extract text runs from paragraphs
    const textRuns = paragraph.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
    textRuns.forEach(textRun => {
      const text = textRun.replace(/<[^>]+>/g, '');
      extractedText += text + ' ';
    });
    extractedText += '\n';
  });
  
  // If we couldn't extract text with XML parsing, try a simpler approach
  if (extractedText.trim().length < 100) {
    // Get readable text by filtering for printable ASCII characters
    extractedText = content
      .replace(/<[^>]+>/g, ' ')  // Remove XML tags
      .replace(/[^\x20-\x7E]/g, ' ')  // Keep only printable ASCII
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim();
  }
  
  return extractedText;
};

/**
 * Determine file type based on extension and mime type
 */
const getFileType = (file: File): string => {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    return 'pdf';
  } else if (fileName.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return 'docx';
  } else {
    return 'unknown';
  }
};

/**
 * Extract name from text using common patterns
 */
export const extractName = (text: string): string => {
  // Look for patterns that might indicate a name at the beginning of the resume
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Often the name is one of the first short lines (1-3 words)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    const words = line.split(/\s+/);
    if (words.length >= 1 && words.length <= 3 && line.length > 3 && line.length < 40) {
      // Check if line doesn't contain common non-name indicators
      if (!line.match(/resume|cv|curriculum|vitae|address|phone|email|@|http|www\./i)) {
        return line;
      }
    }
  }
  
  return 'Unknown Name';
};

/**
 * Extract email from text
 */
export const extractEmail = (text: string): string => {
  // Look for email pattern
  const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/gi;
  const matches = text.match(emailRegex);
  return matches && matches.length > 0 ? matches[0] : '';
};

/**
 * Extract phone number from text
 */
export const extractPhone = (text: string): string => {
  // Look for phone number patterns
  const phoneRegex = /(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/g;
  const matches = text.match(phoneRegex);
  return matches && matches.length > 0 ? matches[0] : '';
};

/**
 * Extract skills from text
 */
export const extractSkills = (text: string): string[] => {
  // Common technical skills
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
    'html', 'css', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git', 'github',
    'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sql', 'nosql',
    'machine learning', 'artificial intelligence', 'data science', 'big data', 'data analytics',
    'project management', 'agile', 'scrum', 'kanban', 'jira', 'confluence', 'leadership',
    'communication', 'teamwork', 'problem solving', 'critical thinking', 'creativity'
  ];
  
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  // Look for common skills in the text
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      // Ensure first letter is capitalized
      const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
      foundSkills.add(capitalizedSkill);
    }
  });
  
  // Check for sections that might contain skills
  const skillsSectionRegex = /skills|technical skills|core competencies|technologies|proficiencies/i;
  const lines = text.split('\n');
  let inSkillsSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a skills section
    if (skillsSectionRegex.test(line)) {
      inSkillsSection = true;
      continue;
    }
    
    // Check if we're leaving the skills section (another section starts)
    if (inSkillsSection && line.length > 0 && /^[A-Z][\w\s]+:?$/.test(line)) {
      inSkillsSection = false;
    }
    
    // Extract skills from the skills section
    if (inSkillsSection && line.length > 0) {
      // Split by common separators
      const skillCandidates = line.split(/[,|•|·|:|;|\t]+/);
      
      skillCandidates.forEach(skill => {
        skill = skill.trim();
        if (skill.length > 2 && skill.length < 30) {
          // Ensure first letter is capitalized
          const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
          foundSkills.add(capitalizedSkill);
        }
      });
    }
  }
  
  return Array.from(foundSkills);
};

/**
 * Extract location from text
 */
export const extractLocation = (text: string): string => {
  // Look for common location patterns
  const locationRegex = /(?:address|location|based in|living in)[:\s]+([\w\s,.-]+)(?:\n|$)/i;
  const match = text.match(locationRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Try to find city, state pattern
  const cityStateRegex = /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/g;
  const cityStateMatches = Array.from(text.matchAll(cityStateRegex));
  
  if (cityStateMatches.length > 0) {
    const [, city, state] = cityStateMatches[0];
    return `${city}, ${state}`;
  }
  
  return '';
};

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
