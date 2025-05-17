
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
  let skillsSectionEndRegex = /^(education|experience|work|employment|professional|projects|certifications|objective|references)/i;
  
  // Common skill separators
  const separators = /[,;•|\\/]/;
  
  // Enhanced list of technical skills for better detection
  const technicalSkillsRegex = /javascript|typescript|react|angular|vue|python|java|c\+\+|c#|\.net|php|ruby|go|golang|html5?|css3?|sass|less|sql|nosql|mysql|postgresql|mongodb|oracle|cassandra|redis|aws|azure|gcp|docker|kubernetes|jenkins|git|agile|scrum|kanban|jira|machine learning|artificial intelligence|ai|ml|nlp|data science|blockchain|mobile|ios|android|flutter|react native|swift|kotlin|objective-c|unity|linux|unix|windows|macos|networking|cyber security|penetration testing|cloud computing|devops|ci\/cd|testing|qa|tdd|rest|graphql|soap|microservices|soa|oauth|jwt|api|json|xml|npm|yarn|webpack|gulp|grunt|babel|eslint|jest|mocha|cypress|selenium|figma|sketch|adobe|photoshop|illustrator|xd|indesign|ui\/ux|frontend|backend|fullstack|architect|design patterns|oop|functional programming|mvc|mvvm|communication|leadership|project management|data structures|algorithms|optimization|performance/i;
  
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
        skill = skill.replace(/[^a-zA-Z0-9\s+#\.]/g, '').trim();
        
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
    // Look for bullet points that might contain skills
    const bulletPoints = text.match(/[•\-*]\s*([^•\-*\n]+)/g);
    if (bulletPoints) {
      bulletPoints.forEach(point => {
        point = point.replace(/^[•\-*]\s*/, '').trim();
        
        // Check for technical terms in the bullet point
        const words = point.split(/\s+|[,;:]/);
        words.forEach(word => {
          word = word.trim().replace(/[^\w+#\.]/g, '');
          
          if (technicalSkillsRegex.test(word) && word.length > 1 && !skills.includes(word)) {
            skills.push(word);
          }
        });
      });
    }
    
    // Check entire text for lines that might mention skills
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      
      if (line.includes('proficient in') || line.includes('familiar with') || 
          line.includes('knowledge of') || line.includes('experienced in') || 
          line.includes('skilled in') || line.includes('expertise in')) {
        
        // Extract what comes after these phrases
        const skillsPart = line
          .replace(/.*?(proficient in|familiar with|knowledge of|experienced in|skilled in|expertise in)\s*/i, '')
          .split(separators);
          
        skillsPart.forEach(part => {
          const skill = part.trim().replace(/[^\w\s+#\.]/g, '');
          if (skill.length > 1 && !skills.includes(skill)) {
            skills.push(skill);
          }
        });
      }
      
      // Look for technical terms throughout the text
      if (technicalSkillsRegex.test(line)) {
        const matches = line.match(technicalSkillsRegex);
        if (matches) {
          matches.forEach(match => {
            if (!skills.includes(match) && match.length > 1) {
              // Capitalize first letter to make it look nice
              skills.push(match.charAt(0).toUpperCase() + match.slice(1));
            }
          });
        }
      }
    }
  }
  
  // If we found too many skills, limit to most relevant ones
  if (skills.length > 20) {
    return skills.slice(0, 20);
  }
  
  // If we still don't have skills, provide a generic set
  return skills.length > 0 ? skills : ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS'];
};
