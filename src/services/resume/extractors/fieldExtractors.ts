
/**
 * Field extractors for resume data
 * These functions extract specific pieces of information from resume text
 */

/**
 * Extract name from text using enhanced patterns
 */
export const extractName = (text: string): string => {
  // Look for patterns that might indicate a name at the beginning of the resume
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try multiple approaches for name extraction
  
  // Approach 1: Look for name patterns at the beginning of the resume
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    const words = line.split(/\s+/);
    
    // Check for typical name patterns (1-3 words, not too short or long)
    if (words.length >= 1 && words.length <= 3 && line.length > 3 && line.length < 40) {
      // Check if line doesn't contain common non-name indicators
      if (!line.match(/resume|cv|curriculum|vitae|address|phone|email|@|http|www\.|[0-9]{4,}/i)) {
        return line;
      }
    }
  }
  
  // Approach 2: Look for specific name patterns
  const namePatterns = [
    /^([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})$/m,  // Capitalized first and last name
    /name:?\s+([A-Z][a-z]+(?: [A-Z][a-z]+){1,2})/i,  // "Name:" followed by name
    /^([A-Z][A-Z\s]+)$/m,  // All caps name
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Normalize case (if all uppercase)
      const name = match[1].replace(/([A-Z])([A-Z]+)/g, (_, first, rest) => first + rest.toLowerCase());
      return name.trim();
    }
  }
  
  return 'Unknown Name';
};

/**
 * Extract email from text with enhanced patterns
 */
export const extractEmail = (text: string): string => {
  // Enhanced email pattern matching
  const emailPatterns = [
    /[\w.+-]+@[\w-]+\.[\w.-]+/gi,  // Standard email
    /email:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "Email:" followed by email
    /e-mail:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "E-mail:" followed by email
    /mail:?\s*([\w.+-]+@[\w-]+\.[\w.-]+)/gi,  // "Mail:" followed by email
  ];
  
  for (const pattern of emailPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // For patterns with capturing groups, extract the group
      if (pattern.toString().includes('(')) {
        const match = pattern.exec(text);
        if (match && match[1]) {
          return match[1];
        }
      } else {
        return matches[0];
      }
    }
  }
  
  return '';
};

/**
 * Extract phone number from text with enhanced patterns
 */
export const extractPhone = (text: string): string => {
  // Enhanced phone number pattern matching
  const phonePatterns = [
    /(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/g,  // Standard US phone
    /phone:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Phone:" followed by phone
    /mobile:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Mobile:" followed by phone
    /cell:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Cell:" followed by phone
    /tel:?\s*(\+?1[-\s]?)?(\(?\d{3}\)?[-\s]?)?\d{3}[-\s]?\d{4}/gi,  // "Tel:" followed by phone
  ];
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      // Clean up and standardize the phone number format
      let phone = matches[0].replace(/phone:?\s*/i, '');
      
      // Format the phone number for consistency
      phone = phone.replace(/[^\d+]/g, '');
      if (phone.length === 10) {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (phone.length === 11 && phone.startsWith('1')) {
        return phone.replace(/1(\d{3})(\d{3})(\d{4})/, '+1 $1-$2-$3');
      }
      
      return matches[0];
    }
  }
  
  return '';
};

/**
 * Extract location from text with enhanced patterns
 */
export const extractLocation = (text: string): string => {
  // Enhanced location pattern matching
  
  // Look for explicit location labels
  const labeledLocationPatterns = [
    /(?:address|location|based in|living in|located in)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
    /(?:city|town|state|province|region)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
    /(?:residence|residing in|resides in)[:\s]+([\w\s,.-]+)(?:\n|$)/i,
  ];
  
  for (const pattern of labeledLocationPatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].trim().length > 2) {
      return match[1].trim();
    }
  }
  
  // Try to find city, state pattern (common in US resumes)
  const cityStatePatterns = [
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),\s*([A-Z]{2})/g,  // City, ST
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*)\s+([A-Z]{2})\s+\d{5}/g,  // City ST ZIP
  ];
  
  for (const pattern of cityStatePatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      const [, city, state] = matches[0];
      return `${city}, ${state}`;
    }
  }
  
  // Look for postal/zip code patterns with cities
  const postalPatterns = [
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),?(?:\s+[A-Z]{2})?\s+(\d{5}(-\d{4})?)/g,  // City, ZIP or City ZIP
    /([A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*),?(?:\s+[A-Z]{2})?\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)/g,  // Canadian postal code
  ];
  
  for (const pattern of postalPatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length > 0) {
      const [, city, postal] = matches[0];
      return `${city} ${postal}`;
    }
  }
  
  return '';
};

/**
 * Extract skills from text with enhanced detection
 */
export const extractSkills = (text: string): string[] => {
  // Extended list of common technical and soft skills
  const commonSkills = [
    // Technical skills
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
    'html', 'css', 'react', 'angular', 'vue', 'svelte', 'node', 'express', 'django', 'flask', 
    'spring', 'laravel', 'rails', 'tailwind', 'bootstrap', 'jquery', 'json', 'rest api',
    'graphql', 'ajax', 'xml', 'soap', 'sass', 'less', 'webpack', 'vite', 'parcel', 'babel',
    'next.js', 'gatsby', 'nuxt', 'flutter', 'react native', 'swift', 'kotlin', 'android',
    'ios', 'mobile development', 'responsive design', 'web development', 'aws', 'azure', 
    'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'circleci', 'github actions',
    'ci/cd', 'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello', 'asana',
    'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'sql', 'nosql', 'oracle',
    'database', 'data modeling', 'data analysis', 'data visualization', 'power bi',
    'tableau', 'd3.js', 'machine learning', 'deep learning', 'artificial intelligence', 
    'data science', 'big data', 'hadoop', 'spark', 'kafka', 'etl', 'r', 'matlab', 'numpy',
    'pandas', 'scikit-learn', 'tensorflow', 'pytorch', 'nlp', 'computer vision',
    
    // Cloud platforms and DevOps
    'aws', 'ec2', 's3', 'lambda', 'azure', 'gcp', 'heroku', 'netlify', 'vercel', 
    'digital ocean', 'devops', 'ci/cd', 'jenkins', 'travis ci', 'github actions',
    'docker', 'kubernetes', 'containerization', 'infrastructure as code', 'terraform',
    'ansible', 'puppet', 'chef', 'serverless', 'microservices', 'monitoring', 'logging',
    
    // Soft skills
    'leadership', 'management', 'team management', 'project management', 'agile', 'scrum', 
    'kanban', 'waterfall', 'critical thinking', 'problem solving', 'decision making',
    'communication', 'teamwork', 'collaboration', 'time management', 'organization', 
    'adaptability', 'flexibility', 'creativity', 'innovation', 'analytical skills',
    'research', 'presentation', 'public speaking', 'negotiation', 'conflict resolution',
    'customer service', 'interpersonal skills', 'emotional intelligence', 'mentoring',
    'training', 'coaching', 'strategic planning', 'budget management', 'resource allocation',
    'risk management', 'quality assurance', 'process improvement', 'business analysis'
  ];
  
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  
  // Look for common skills in the text
  commonSkills.forEach(skill => {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(lowerText)) {
      // Ensure first letter is capitalized
      const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
      foundSkills.add(capitalizedSkill);
    }
  });
  
  // Enhanced section detection
  // Check for sections that might contain skills
  const skillSectionPatterns = [
    /skills|technical skills|core competencies|technologies|proficiencies|expertise|qualifications|competencies/i,
    /technical profile|programming languages|software|tools|frameworks|platforms/i
  ];
  
  const lines = text.split('\n');
  let inSkillsSection = false;
  let skillSectionStartIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're entering a skills section
    if (!inSkillsSection) {
      for (const pattern of skillSectionPatterns) {
        if (pattern.test(line)) {
          inSkillsSection = true;
          skillSectionStartIndex = i;
          break;
        }
      }
    }
    
    // Check if we're leaving the skills section (another section starts)
    if (inSkillsSection && i > skillSectionStartIndex) {
      // Look for a new section heading
      if (/^[A-Z][\w\s]{2,20}:?$/m.test(line) || 
          /^(education|experience|work|employment|projects|certifications|awards)/i.test(line)) {
        inSkillsSection = false;
      }
    }
    
    // Extract skills from the skills section
    if (inSkillsSection && line.length > 0 && i > skillSectionStartIndex) {
      // Split by common separators
      const skillCandidates = line.split(/[,|•|·|:|;|\t|\/]+/);
      
      skillCandidates.forEach(skill => {
        skill = skill.trim();
        // Filter out things that don't look like skills (too short, too long, etc.)
        if (skill.length > 2 && skill.length < 30 && !/^\d+$/.test(skill)) {
          // Ensure first letter is capitalized
          const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
          foundSkills.add(capitalizedSkill);
        }
      });
    }
  }
  
  return Array.from(foundSkills);
};
