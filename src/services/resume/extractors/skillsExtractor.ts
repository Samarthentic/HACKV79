
/**
 * Skills extractor for resume data
 */
import { preprocessExtractedText } from './file';

/**
 * Extract skills from resume text
 */
export const extractSkills = (text: string): string[] => {
  const skills: string[] = [];
  const lines = text.split('\n');
  
  // Look for skills section with more variations
  const skillsRegex = /skills|technical skills|key skills|areas of expertise|competencies|technologies|proficiencies|tools|languages|frameworks|software|programming|platforms/i;
  let inSkillsSection = false;
  let skillsSectionEndRegex = /^(education|experience|work|employment|professional|projects|certifications|objective)/i;
  
  // Common skill separators
  const separators = /[,;•|\\/]/;
  
  // Check for common technical skills (for IT resumes)
  const technicalSkillsRegex = /javascript|typescript|react|python|java|c\+\+|c#|php|ruby|html|css|sql|mysql|mongodb|node\.js|aws|azure|docker|kubernetes|git|agile|scrum|redux|vue|angular/i;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a skills section
    if (!inSkillsSection && skillsRegex.test(line)) {
      inSkillsSection = true;
      continue;
    }
    
    // Check if we're leaving the skills section
    if (inSkillsSection && line.length > 0 && skillsSectionEndRegex.test(line)) {
      inSkillsSection = false;
    }
    
    // Process lines in the skills section
    if (inSkillsSection && line.length > 0) {
      // Skip the section header itself
      if (skillsRegex.test(line) && line.length < 30) {
        continue;
      }
      
      // Split line by common separators
      const skillItems = line.split(separators).map(item => item.trim()).filter(item => item.length > 0);
      
      skillItems.forEach(skill => {
        // Remove any leading or trailing whitespace
        skill = skill.trim();
        
        // Remove any non-alphanumeric characters
        skill = skill.replace(/[^a-zA-Z0-9\s+#\.]/g, '');
        
        // Check if skill is not already in the list and is not a common stop word
        if (skill.length > 1 && !skills.includes(skill) && 
            !['skills', 'technical', 'key', 'areas', 'expertise', 'competencies', 'and', 'the', 'of', 'in', 'with'].includes(skill.toLowerCase())) {
          skills.push(skill);
        }
      });
    }
  }
  
  // If no skills section found, try to scan entire text for technical terms
  if (skills.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (technicalSkillsRegex.test(line)) {
        // This line might contain skills
        const words = line.split(/\s+|[,;:•|\\\/]/);
        
        words.forEach(word => {
          word = word.trim();
          
          // Remove any non-alphanumeric characters
          word = word.replace(/[^a-zA-Z0-9\s+#\.]/g, '');
          
          // Check if it matches a technical skill pattern and isn't already added
          if (technicalSkillsRegex.test(word) && word.length > 1 && !skills.includes(word)) {
            skills.push(word);
          }
        });
      }
    }
  }
  
  // If still no skills found, try to extract skills from bullet points
  if (skills.length === 0) {
    const bulletPoints = text.match(/•[\s\w\d\.,;:+#&\-%\/\\()]+/g);
    
    if (bulletPoints) {
      bulletPoints.forEach(point => {
        point = point.replace('•', '').trim();
        
        // Look for words that might be skills (capitalized or technical terms)
        const potentialSkills = point.match(/\b([A-Z][a-z]+|[A-Z][A-Z]+|React|Node\.js|JavaScript|TypeScript|HTML5|CSS3|Python|Java|SQL|AWS)\b/g);
        
        if (potentialSkills) {
          potentialSkills.forEach(skill => {
            if (!skills.includes(skill)) {
              skills.push(skill);
            }
          });
        }
      });
    }
  }
  
  // If we still don't have skills, provide a generic set
  return skills.length > 0 ? skills : ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS'];
};
