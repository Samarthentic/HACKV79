/**
 * Skills extractor for resume data
 */

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
