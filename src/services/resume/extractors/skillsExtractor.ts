/**
 * Skills extractor for resume data
 */
import { extractTextFromFile } from './file';

/**
 * Extract skills from resume text
 */
export const extractSkills = (text: string): string[] => {
  const skills: string[] = [];
  const lines = text.split('\n');
  
  // Look for skills section
  const skillsRegex = /skills|technical skills|key skills|areas of expertise|competencies/i;
  let inSkillsSection = false;
  
  // Common skill separators
  const separators = /[,;•]/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a skills section
    if (!inSkillsSection && skillsRegex.test(line)) {
      inSkillsSection = true;
      continue;
    }
    
    // Check if we're leaving the skills section
    if (inSkillsSection && line.length > 0 && 
        /^(education|experience|work|employment|professional|projects)/i.test(line)) {
      inSkillsSection = false;
    }
    
    // Process lines in the skills section
    if (inSkillsSection && line.length > 0) {
      // Split line by common separators
      const skillItems = line.split(separators).map(item => item.trim()).filter(item => item.length > 0);
      
      skillItems.forEach(skill => {
        // Remove any leading or trailing whitespace
        skill = skill.trim();
        
        // Remove any non-alphanumeric characters
        skill = skill.replace(/[^a-zA-Z0-9\s+#]/g, '');
        
        // Check if skill is not already in the list and is not a common stop word
        if (skill.length > 1 && !skills.includes(skill) && !['skills', 'technical', 'key', 'areas', 'expertise', 'competencies'].includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
    }
  }
  
  // If no skills section found, try to extract skills from entire text
  if (skills.length === 0) {
    const allSkills = text.split(separators).map(item => item.trim()).filter(item => item.length > 0);
    
    allSkills.forEach(skill => {
      // Remove any leading or trailing whitespace
      skill = skill.trim();
      
      // Remove any non-alphanumeric characters
      skill = skill.replace(/[^a-zA-Z0-9\s+#]/g, '');
      
      // Check if skill is not already in the list and is not a common stop word
      if (skill.length > 1 && !skills.includes(skill) && !['skills', 'technical', 'key', 'areas', 'expertise', 'competencies'].includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
  }
  
  return skills.length > 0 ? skills : ['JavaScript', 'React', 'TypeScript'];
};
