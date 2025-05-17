
/**
 * Field extractors for resume data
 * These functions extract specific pieces of information from resume text
 */

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
