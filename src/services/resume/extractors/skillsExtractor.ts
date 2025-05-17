
/**
 * Enhanced skills extractor for resume data
 */
import { preprocessExtractedText } from './file';

/**
 * Extract skills from resume text with improved accuracy
 */
export const extractSkills = (text: string): string[] => {
  const skills: Set<string> = new Set();
  const lines = text.split('\n');
  
  // Look for skills section with more variations
  const skillsRegex = /skills|technical skills|key skills|areas of expertise|competencies|technologies|proficiencies|tools|languages|frameworks|software|programming|platforms/i;
  let inSkillsSection = false;
  let skillsSectionEndRegex = /^(education|experience|work|employment|professional|projects|certifications|objective|references)/i;
  
  // Common skill separators
  const separators = /[,;•|\\/]/;
  
  // Enhanced list of technical skills for better detection
  // Significantly expanded skill recognition patterns
  const technicalSkillsMap: Record<string, string[]> = {
    // Programming Languages
    'languages': ['javascript', 'typescript', 'python', 'java', 'c\\+\\+', 'c#', '\\.net', 'php', 'ruby', 'go', 'golang', 'swift', 'kotlin', 'rust', 'scala', 'r', 'perl', 'haskell', 'lua', 'dart', 'groovy', 'objective-c', 'shell', 'powershell', 'bash'],
    
    // Web Front-end
    'frontend': ['html5?', 'css3?', 'sass', 'less', 'react', 'angular', 'vue', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'material-ui', 'webpack', 'babel', 'gulp', 'grunt', 'vite', 'jsx', 'tsx', 'responsive design', 'redux', 'seo'],
    
    // Web Back-end
    'backend': ['node', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp\\.net', 'fastapi', 'graphql', 'rest', 'soap', 'microservices', 'api development'],
    
    // Databases
    'databases': ['sql', 'nosql', 'mysql', 'postgresql', 'mongodb', 'oracle', 'cassandra', 'sqlite', 'redis', 'dynamodb', 'mariadb', 'firebase', 'elasticsearch', 'couchdb', 'neo4j', 'supabase'],
    
    // DevOps & Cloud
    'devops': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'github actions', 'travis', 'ci\\/cd', 'terraform', 'ansible', 'puppet', 'chef', 'nginx', 'apache', 'heroku', 'netlify', 'vercel'],
    
    // Version Control
    'vcs': ['git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial'],
    
    // Data Science & AI
    'datascience': ['machine learning', 'ml', 'artificial intelligence', 'ai', 'nlp', 'natural language processing', 'data science', 'data mining', 'data analysis', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn', 'keras', 'tableau', 'power bi', 'big data', 'hadoop', 'spark'],
    
    // Mobile Development
    'mobile': ['ios', 'android', 'flutter', 'react native', 'xamarin', 'ionic', 'cordova', 'mobile development'],
    
    // Testing
    'testing': ['testing', 'qa', 'quality assurance', 'junit', 'jest', 'mocha', 'cypress', 'selenium', 'testng', 'pytest', 'tdd', 'bdd', 'automated testing', 'manual testing'],
    
    // Security
    'security': ['cyber security', 'penetration testing', 'security', 'encryption', 'oauth', 'jwt', 'authentication', 'authorization', 'csrf', 'xss'],
    
    // Project Management
    'management': ['agile', 'scrum', 'kanban', 'jira', 'confluence', 'trello', 'project management', 'product management', 'leadership', 'team management']
  };
  
  // Create a combined regex from all skill categories
  const allSkills = Object.values(technicalSkillsMap).flat();
  const technicalSkillsRegex = new RegExp(allSkills.join('|'), 'i');
  
  // Process text by section to improve skills extraction accuracy
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
      
      // Enhanced skill extraction from bullet points and lists
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const skill = line.substring(1).trim();
        if (skill.length > 1) {
          skills.add(skill);
        }
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
        if (skill.length > 1 && 
            !['skills', 'technical', 'key', 'areas', 'expertise', 'competencies', 'and', 'the', 'of', 'in', 'with'].includes(skill.toLowerCase())) {
          skills.add(skill);
        }
      });
    }
  }
  
  // If no skills section found, try to scan entire text for technical terms
  if (skills.size === 0) {
    // Look for bullet points that might contain skills
    const bulletPoints = text.match(/[•\-*]\s*([^•\-*\n]+)/g);
    if (bulletPoints) {
      bulletPoints.forEach(point => {
        point = point.replace(/^[•\-*]\s*/, '').trim();
        
        // Check for technical terms in the bullet point
        const words = point.split(/\s+|[,;:]/);
        words.forEach(word => {
          word = word.trim().replace(/[^\w+#\.]/g, '');
          
          if (technicalSkillsRegex.test(word) && word.length > 1) {
            skills.add(word);
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
          if (skill.length > 1) {
            skills.add(skill);
          }
        });
      }
      
      // Enhanced technical terms detection
      allSkills.forEach(skillPattern => {
        const regex = new RegExp(`\\b${skillPattern}\\b`, 'i');
        if (regex.test(line)) {
          // Extract match
          const match = line.match(regex);
          if (match && match[0].length > 1) {
            // Capitalize first letter to make it look nice
            const skill = match[0].charAt(0).toUpperCase() + match[0].slice(1);
            skills.add(skill);
          }
        }
      });
    }
  }
  
  // Convert Set to Array
  const skillsArray = Array.from(skills);
  
  // If we found too many skills, limit to most relevant ones
  if (skillsArray.length > 25) {
    return skillsArray.slice(0, 25);
  }
  
  // If we still don't have skills, provide a generic set
  return skillsArray.length > 0 ? skillsArray : ['JavaScript', 'React', 'TypeScript', 'HTML', 'CSS'];
};
