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
    // More aggressive pattern to find names anywhere in text
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+){1,2})(?=\s*\n|$|\s*,)/m,  // Name followed by newline, comma or end
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Normalize case (if all uppercase)
      const name = match[1].replace(/([A-Z])([A-Z]+)/g, (_, first, rest) => first + rest.toLowerCase());
      return name.trim();
    }
  }
  
  // Approach 3: Try to find contact info section and extract name
  const contactSectionPattern = /contact information|personal details|personal information/i;
  const contactSection = text.split('\n').findIndex(line => contactSectionPattern.test(line));
  
  if (contactSection !== -1) {
    // Check next few lines for a name
    for (let i = contactSection + 1; i < Math.min(contactSection + 5, lines.length); i++) {
      const line = lines[i].trim();
      const words = line.split(/\s+/);
      
      // Check for name pattern (2-3 words, properly capitalized)
      if (words.length >= 2 && words.length <= 3 && 
          words.every(word => /^[A-Z][a-z]+$/.test(word))) {
        return line;
      }
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
    /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/gi, // Another email pattern
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
    // International formats
    /\+\d{1,3}[\s-]?\d{1,3}[\s-]?\d{3,5}[\s-]?\d{3,5}/g, // International format with country code
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
      
      return matches[0].trim();
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
  
  // Look for single city name with proper capitalization near contact info
  const contactLines = text.split('\n').slice(0, 20);  // Check first 20 lines
  for (const line of contactLines) {
    // Look for standalone city names (capitalized words)
    if (/^[A-Z][a-z]+(?:[\s-][A-Z][a-z]+)*$/.test(line.trim()) && 
        !line.trim().match(/resume|cv|name|education|experience|skills/i)) {
      return line.trim();
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
    // Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
    'scala', 'kotlin', 'swift', 'objective-c', 'perl', 'shell', 'bash', 'powershell', 'r',
    'matlab', 'groovy', 'lua', 'haskell', 'clojure', 'erlang', 'dart', 'fortran',
    
    // Web Technologies
    'html', 'css', 'html5', 'css3', 'sass', 'less', 'bootstrap', 'tailwind', 'material-ui',
    'jquery', 'ajax', 'json', 'xml', 'rest api', 'soap', 'graphql', 'websockets', 'pwa',
    'web components', 'responsive design', 'cross-browser compatibility',
    
    // Frontend Frameworks
    'react', 'angular', 'vue', 'svelte', 'next.js', 'gatsby', 'nuxt', 'ember', 'backbone',
    'redux', 'mobx', 'vuex', 'recoil', 'jotai', 'zustand', 'webpack', 'vite', 'parcel', 
    'rollup', 'babel', 'eslint', 'prettier', 'stylelint',
    
    // Backend Technologies
    'node', 'express', 'nest.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot',
    'rails', 'laravel', 'symfony', 'asp.net', 'flask', 'fastapi', 'gin', 'echo', 'koa',
    'hapi', 'sails.js', 'meteor', 'feathers', 'adonis', 'loopback',
    
    // Mobile Development
    'react native', 'flutter', 'ionic', 'cordova', 'xamarin', 'android', 'ios', 'swift ui',
    'kotlin multiplatform', 'mobile development', 'responsive design', 'pwa', 'capacitor',
    'native script', 'app development',
    
    // Database Technologies
    'sql', 'mysql', 'postgresql', 'oracle', 'sqlite', 'mongodb', 'cassandra', 'redis',
    'dynamodb', 'couchbase', 'firebase', 'supabase', 'neo4j', 'graphdb', 'elasticsearch',
    'solr', 'database design', 'data modeling', 'orm', 'sql server', 'nosql',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'github actions', 'gitlab ci',
    'circleci', 'travis ci', 'terraform', 'ansible', 'puppet', 'chef', 'ci/cd', 'devops',
    'infrastructure as code', 'cloud architecture', 'serverless', 'lambda', 'ec2', 's3',
    'rds', 'dynamo', 'cloudfront', 'route53', 'cloudwatch', 'azure functions', 'digital ocean',
    'heroku', 'netlify', 'vercel', 'cloudflare', 'nginx', 'apache', 'load balancing',
    
    // Data Science & AI
    'machine learning', 'deep learning', 'artificial intelligence', 'data science', 'tensorflow',
    'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn',
    'jupyter', 'data visualization', 'statistical analysis', 'computer vision', 'nlp',
    'natural language processing', 'big data', 'hadoop', 'spark', 'data mining', 'data analysis',
    'data engineering', 'etl', 'tableau', 'power bi', 'd3.js', 'data warehousing', 'olap',
    
    // Soft Skills & Methodologies
    'agile', 'scrum', 'kanban', 'waterfall', 'lean', 'tdd', 'bdd', 'ddd', 'solid principles',
    'design patterns', 'oop', 'functional programming', 'microservices', 'soa', 'rest',
    'leadership', 'project management', 'team management', 'problem solving', 'critical thinking',
    'communication', 'teamwork', 'time management', 'strategic planning', 'presentation skills',
    'public speaking', 'negotiation', 'conflict resolution', 'mentoring', 'coaching', 'training',
    'analytical skills', 'research', 'customer service', 'client relations', 'stakeholder management',
    'risk management', 'quality assurance', 'process improvement', 'business analysis',
    
    // Security
    'cybersecurity', 'network security', 'information security', 'security testing', 'penetration testing',
    'ethical hacking', 'security auditing', 'encryption', 'authentication', 'authorization', 'oauth',
    'jwt', 'csrf', 'xss', 'sql injection', 'security best practices', 'compliance', 'gdpr',
    'security architecture', 'identity management', 'sso', 'saml', 'firewall', 'vpn', 'ips',
    
    // Testing
    'unit testing', 'integration testing', 'e2e testing', 'functional testing', 'regression testing',
    'performance testing', 'load testing', 'stress testing', 'test automation', 'jest', 'mocha',
    'jasmine', 'cypress', 'selenium', 'puppeteer', 'playwright', 'junit', 'testng', 'pytest',
    'robotframework', 'qunit', 'test-driven development', 'behavior-driven development',
    'manual testing', 'test planning', 'test strategy', 'test cases', 'test scripts',
    
    // Version Control & Collaboration
    'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'jira', 'confluence', 'trello',
    'asana', 'basecamp', 'notion', 'slack', 'microsoft teams', 'zoom', 'agile methodologies',
    'scrum', 'kanban', 'code review', 'pair programming', 'documentation',
    
    // Other Technical Skills
    'restful apis', 'microservices', 'soa', 'soap', 'web services', 'system design',
    'architecture', 'api design', 'ui/ux design', 'accessibility', 'localization',
    'internationalization', 'seo', 'performance optimization',
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
  
  // Extract skills from bullet points in experience sections
  const bulletPointPatterns = [
    /[•·\-\*]\s*([\w\s]+)/g,  // Bullet points followed by text
    /\d+\.\s*([\w\s]+)/g,     // Numbered lists
  ];
  
  bulletPointPatterns.forEach(pattern => {
    const matches = Array.from(text.matchAll(pattern));
    matches.forEach(match => {
      if (match[1]) {
        const bulletText = match[1].toLowerCase();
        commonSkills.forEach(skill => {
          if (bulletText.includes(skill)) {
            const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
            foundSkills.add(capitalizedSkill);
          }
        });
      }
    });
  });
  
  return Array.from(foundSkills);
};
