import { ParsedResume } from '../resume/types';
import { JobListing } from './jobsData';

export interface JobMatch {
  job: JobListing;
  fitPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}

/**
 * Calculate job matches based on resume skills
 * @param resume The user's parsed resume
 * @param jobs Array of job listings to match against
 * @returns Array of job matches with scores
 */
export const calculateJobMatches = (resume: ParsedResume, jobs: JobListing[]): JobMatch[] => {
  console.log("Matching jobs to resume skills:", resume.skills);
  
  const matches: JobMatch[] = [];

  // For each job, calculate a match score
  for (const job of jobs) {
    const jobSkills = extractJobSkills(job.description);
    const jobKeywords = extractJobKeywords(job.description);
    console.log(`Job ${job.title} skills:`, jobSkills);
    
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    
    // Find matching skills with improved matching algorithm
    for (const skill of jobSkills) {
      if (hasMatchingSkill(resume.skills, skill)) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
    
    // Calculate match percentage with weighted components
    let skillsScore = 0;
    if (jobSkills.length > 0) {
      skillsScore = (matchingSkills.length / jobSkills.length) * 100;
    }
    
    // Apply education, experience, and keyword bonuses
    const educationBonus = calculateEducationBonus(resume, job);
    const experienceBonus = calculateExperienceBonus(resume, job);
    const keywordBonus = calculateKeywordBonus(resume, jobKeywords);
    
    const jobRelevanceScore = calculateJobRelevance(resume.experience, job.title);
    
    // Calculate final weighted score
    let fitPercentage = skillsScore * 0.6 + // Skills are most important
                        educationBonus * 0.15 + 
                        experienceBonus * 0.15 +
                        keywordBonus * 0.05 +
                        jobRelevanceScore * 0.05;
    
    // Round and cap at 100%
    fitPercentage = Math.min(100, Math.round(fitPercentage));
    
    console.log(`${job.title} match details:
      - Skills Score: ${skillsScore.toFixed(1)}%
      - Education Bonus: ${educationBonus}
      - Experience Bonus: ${experienceBonus}
      - Keyword Bonus: ${keywordBonus}
      - Job Relevance Score: ${jobRelevanceScore}
      - Final Score: ${fitPercentage}%`);
    
    matches.push({
      job,
      fitPercentage,
      matchingSkills,
      missingSkills
    });
  }
  
  // Sort matches by fit percentage (descending)
  return matches.sort((a, b) => b.fitPercentage - a.fitPercentage);
};

/**
 * Extract key skills from a job description with improved pattern matching
 */
const extractJobSkills = (description: string): string[] => {
  const skills = new Set<string>();
  
  // Enhanced skill keywords to look for with more precise patterns
  const skillPatterns = [
    // Programming languages and frameworks
    /\b(?:JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|Go|Swift|Kotlin|Rust|Scala|Perl|Shell|Bash|SQL|HTML|CSS|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Ruby on Rails)\b/gi,
    
    // Databases
    /\b(?:SQL|MySQL|PostgreSQL|MongoDB|SQLite|Oracle|NoSQL|Firebase|DynamoDB|Cassandra|Redis|Elasticsearch)\b/gi,
    
    // Cloud and devops
    /\b(?:AWS|Azure|GCP|Google Cloud|Heroku|Docker|Kubernetes|CI\/CD|Jenkins|Git|GitHub|GitLab|Terraform|Ansible|Chef|Puppet)\b/gi,
    
    // Data science and AI
    /\b(?:Machine Learning|ML|Deep Learning|DL|AI|NLP|Computer Vision|TensorFlow|PyTorch|Scikit-learn|pandas|NumPy|R|Data Mining|Statistics|Big Data|Data Visualization|Tableau|Power BI)\b/gi,
    
    // Professional skills
    /\b(?:Project Management|Agile|Scrum|Kanban|Leadership|Communication|Problem Solving|Team Management|Critical Thinking|Time Management)\b/gi,
    
    // Security
    /\b(?:Cybersecurity|SIEM|Firewalls|Encryption|Security Analysis|Vulnerability Assessment|Penetration Testing|CISSP|CEH|Security\+)\b/gi,
    
    // Design
    /\b(?:UX|UI|User Experience|User Interface|Figma|Sketch|Adobe XD|Photoshop|Illustrator|Wireframing|Prototyping)\b/gi,
    
    // Blockchain
    /\b(?:Blockchain|Ethereum|Smart Contracts|Solidity|Web3|Cryptocurrency|NFT|DeFi|DApp)\b/gi,
    
    // Mobile
    /\b(?:Android|iOS|Swift|Kotlin|React Native|Flutter|Mobile Development|App Development)\b/gi,
    
    // Networking
    /\b(?:Network|TCP\/IP|DNS|DHCP|VPN|Cisco|Juniper|Routing|Switching|Firewall)\b/gi,
    
    // Business Intelligence
    /\b(?:Business Intelligence|BI|ETL|Data Warehouse|OLAP|OLTP|Dimensional Modeling|Star Schema)\b/gi,
  ];
  
  // Extract skills using patterns
  for (const pattern of skillPatterns) {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Normalize skill (remove extra spaces, make consistent case)
        const normalized = match.trim();
        skills.add(normalized);
      });
    }
  }
  
  return Array.from(skills);
};

/**
 * Extract important job keywords beyond technical skills
 */
const extractJobKeywords = (description: string): string[] => {
  const keywords = new Set<string>();
  
  // Job role specific keywords
  const keywordPatterns = [
    // Experience levels
    /\b(?:Junior|Senior|Lead|Principal|Entry[ -]Level|Mid[ -]Level|Staff)\b/gi,
    
    // Industry domains
    /\b(?:Finance|Healthcare|E-commerce|Manufacturing|Education|Retail|Energy|Automotive|Entertainment|Government)\b/gi,
    
    // Soft skills and attributes
    /\b(?:Collaborative|Team Player|Self-Motivated|Detail-Oriented|Innovative|Creative|Analytical|Strategic)\b/gi,
    
    // Leadership keywords
    /\b(?:Manage|Lead|Direct|Oversee|Coordinate|Supervise)\b/gi,
    
    // Degree requirements
    /\b(?:Bachelor's|Master's|PhD|Doctorate|Degree)\b/gi
  ];
  
  // Extract keywords using patterns
  for (const pattern of keywordPatterns) {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalized = match.trim();
        keywords.add(normalized);
      });
    }
  }
  
  return Array.from(keywords);
};

/**
 * Check if resume skills contain a matching skill with improved fuzzy matching
 */
const hasMatchingSkill = (resumeSkills: string[], jobSkill: string): boolean => {
  const normalizedJobSkill = jobSkill.toLowerCase();
  
  // Directly check for exact match or substring match
  const directMatch = resumeSkills.some(skill => {
    const normalizedResumeSkill = skill.toLowerCase();
    return (
      normalizedResumeSkill.includes(normalizedJobSkill) || 
      normalizedJobSkill.includes(normalizedResumeSkill)
    );
  });
  
  if (directMatch) return true;
  
  // Check for related skills (e.g., "React" matches "React.js" or "ReactJS")
  const relatedMatches = {
    "javascript": ["js", "es6", "ecmascript"],
    "typescript": ["ts"],
    "react": ["reactjs", "react.js"],
    "node": ["nodejs", "node.js"],
    "angular": ["angularjs", "angular.js"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp"],
    "microsoft azure": ["azure"],
    "continuous integration": ["ci", "ci/cd"],
    "continuous deployment": ["cd", "ci/cd"],
    "machine learning": ["ml"],
    "artificial intelligence": ["ai"],
    "natural language processing": ["nlp"],
    "deep learning": ["dl"],
    "user experience": ["ux"],
    "user interface": ["ui"]
  };
  
  // Check for related skills
  for (const [key, aliases] of Object.entries(relatedMatches)) {
    if (normalizedJobSkill.includes(key) || key.includes(normalizedJobSkill)) {
      // Check if any alias is in resume skills
      const hasRelatedSkill = resumeSkills.some(skill => {
        const normalizedSkill = skill.toLowerCase();
        return aliases.some(alias => normalizedSkill.includes(alias));
      });
      
      if (hasRelatedSkill) return true;
    }
    
    // Check if any alias of job skill is in resume skills
    if (aliases.some(alias => normalizedJobSkill.includes(alias))) {
      const hasKeySkill = resumeSkills.some(skill => {
        const normalizedSkill = skill.toLowerCase();
        return normalizedSkill.includes(key);
      });
      
      if (hasKeySkill) return true;
    }
  }
  
  return false;
};

/**
 * Calculate education bonus based on degree requirements with improved matching
 */
const calculateEducationBonus = (resume: ParsedResume, job: JobListing): number => {
  // Extract degree requirements from job description
  const requiresAssociate = job.description.includes("Associate") || job.description.includes("2-year degree");
  const requiresBachelors = job.description.includes("Bachelor") || 
                          job.description.includes("B.S.") || 
                          job.description.includes("B.A.");
  const requiresMasters = job.description.includes("Master") || 
                        job.description.includes("M.S.") || 
                        job.description.includes("M.A.");
  const requiresPhD = job.description.includes("Ph.D") || 
                    job.description.includes("Doctorate") || 
                    job.description.includes("Doctoral");
  
  // Check resume for degrees
  const hasAssociate = resume.education.some(edu => 
    edu.degree.includes("Associate") || edu.degree.includes("A.A.")
  );
  
  const hasBachelors = resume.education.some(edu => 
    edu.degree.includes("Bachelor") || 
    edu.degree.includes("B.S.") || 
    edu.degree.includes("B.A.")
  );
  
  const hasMasters = resume.education.some(edu => 
    edu.degree.includes("Master") || 
    edu.degree.includes("M.S.") || 
    edu.degree.includes("M.A.")
  );
  
  const hasPhD = resume.education.some(edu => 
    edu.degree.includes("Ph.D") || 
    edu.degree.includes("Doctorate") || 
    edu.degree.includes("Doctoral")
  );
  
  // Calculate bonus based on matching or exceeding requirements
  let bonus = 0;
  
  if (requiresPhD && hasPhD) {
    bonus = 15; // Perfect match for PhD
  } else if (requiresMasters) {
    if (hasMasters || hasPhD) {
      bonus = 12; // Match or exceed Master's requirement
    }
  } else if (requiresBachelors) {
    if (hasBachelors || hasMasters || hasPhD) {
      bonus = 10; // Match or exceed Bachelor's requirement
    }
  } else if (requiresAssociate) {
    if (hasAssociate || hasBachelors || hasMasters || hasPhD) {
      bonus = 8; // Match or exceed Associate's requirement
    }
  } else if (hasBachelors) {
    bonus = 5; // Bonus for having a degree even if not explicitly required
  }
  
  // Field of study relevance check
  const jobFields = extractFieldsOfStudy(job.description);
  if (jobFields.length > 0) {
    const relevantField = resume.education.some(edu => 
      jobFields.some(field => 
        edu.degree.toLowerCase().includes(field.toLowerCase())
      )
    );
    
    if (relevantField) {
      bonus += 5; // Additional bonus for relevant field of study
    }
  }
  
  return bonus;
};

/**
 * Extract fields of study from job description
 */
const extractFieldsOfStudy = (description: string): string[] => {
  const fields = new Set<string>();
  const fieldPatterns = [
    /(?:degree in|background in|education in) ([A-Za-z ,]+?)(?:or|,|\.|and)/gi,
    /(?:Computer Science|Information Technology|Engineering|Mathematics|Business|Economics|Finance|Marketing)/gi
  ];
  
  for (const pattern of fieldPatterns) {
    const matches = description.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        // If captured group exists, use it
        const field = match[1].trim();
        if (field) fields.add(field);
      } else if (match[0]) {
        // Otherwise use the full match
        fields.add(match[0].trim());
      }
    }
  }
  
  return Array.from(fields);
};

/**
 * Calculate experience bonus based on years and relevance with improved matching
 */
const calculateExperienceBonus = (resume: ParsedResume, job: JobListing): number => {
  // Extract required years from job description
  const yearsRequired = extractYearsRequired(job.description);
  
  // Estimate years of experience from resume
  const yearsOfExperience = estimateYearsOfExperience(resume.experience);
  
  // Calculate bonus based on years
  let bonus = 0;
  if (yearsOfExperience >= yearsRequired) {
    // Meets or exceeds requirements
    bonus = 10;
  } else if (yearsOfExperience >= yearsRequired * 0.75) {
    // Close to required experience
    bonus = 7;
  } else if (yearsOfExperience > 0) {
    // Has some relevant experience
    bonus = 5;
  }
  
  // Add bonus for relevant industry experience
  if (hasRelevantIndustryExperience(resume.experience, job.description)) {
    bonus += 5;
  }
  
  return bonus;
};

/**
 * Extract years of experience required from job description
 */
const extractYearsRequired = (description: string): number => {
  // Look for patterns like "X+ years", "X years of experience", etc.
  const patterns = [
    /(\d+)(?:\+)? years? of experience/i,
    /(\d+)(?:\+)? years? experience/i,
    /experience: (\d+)(?:\+)? years?/i,
    /minimum (?:of )?(\d+)(?:\+)? years?/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  
  // Default if no explicit requirement is found
  return 2; // Most jobs implicitly want some experience
};

/**
 * Estimate years of experience from resume
 */
const estimateYearsOfExperience = (experience: Array<any>): number => {
  if (!experience || experience.length === 0) return 0;
  
  let totalYears = 0;
  
  for (const job of experience) {
    if (job.period) {
      const years = extractYearsFromPeriod(job.period);
      totalYears += years;
    }
  }
  
  return Math.min(20, totalYears); // Cap at 20 years to avoid overweighting
};

/**
 * Extract years from a period string like "2018-2021" or "Jan 2018 - Mar 2021"
 */
const extractYearsFromPeriod = (period: string): number => {
  // Try to extract years from formats like "2018-2021" or "2018 - 2021"
  const yearPattern = /(\d{4})(?:\s*-\s*|–|—|to\s*)(?:present|current|now|(\d{4}))/i;
  const match = period.match(yearPattern);
  
  if (match) {
    const startYear = parseInt(match[1], 10);
    const endYear = match[2] ? parseInt(match[2], 10) : new Date().getFullYear();
    return endYear - startYear;
  }
  
  // If no clear year pattern, assume 1 year per position as a fallback
  return 1;
};

/**
 * Check if candidate has relevant industry experience
 */
const hasRelevantIndustryExperience = (experience: Array<any>, jobDescription: string): boolean => {
  // Extract industry keywords from job description
  const industries = [
    "healthcare", "finance", "banking", "technology", "retail", "manufacturing", 
    "education", "government", "non-profit", "media", "advertising", "consulting",
    "insurance", "real estate", "telecommunications", "energy", "automotive"
  ];
  
  // Find mentioned industries in job description
  const mentionedIndustries = industries.filter(industry => 
    jobDescription.toLowerCase().includes(industry)
  );
  
  // If no specific industry is mentioned, return false
  if (mentionedIndustries.length === 0) {
    return false;
  }
  
  // Check if any experience matches the mentioned industries
  return experience.some(job => 
    mentionedIndustries.some(industry => 
      job.description && job.description.toLowerCase().includes(industry) ||
      job.company && job.company.toLowerCase().includes(industry)
    )
  );
};

/**
 * Calculate bonus for matching important job keywords
 */
const calculateKeywordBonus = (resume: ParsedResume, jobKeywords: string[]): number => {
  if (jobKeywords.length === 0) return 0;
  
  let matchedKeywords = 0;
  
  // Check for keywords in resume text (combining all fields)
  const resumeText = [
    resume.personalInfo.name,
    resume.personalInfo.location,
    ...resume.education.map(e => `${e.degree} ${e.institution}`),
    ...resume.experience.map(e => `${e.title} ${e.company} ${e.description}`),
    ...resume.certifications.map(c => `${c.name} ${c.issuer}`),
    ...resume.skills
  ].join(' ').toLowerCase();
  
  // Count matching keywords
  for (const keyword of jobKeywords) {
    if (resumeText.includes(keyword.toLowerCase())) {
      matchedKeywords++;
    }
  }
  
  // Calculate bonus percentage
  const matchRate = jobKeywords.length > 0 ? matchedKeywords / jobKeywords.length : 0;
  return Math.round(matchRate * 10); // Up to 10 points bonus
};

/**
 * Calculate job title relevance score
 */
const calculateJobRelevance = (experience: Array<any>, jobTitle: string): number => {
  if (!experience || experience.length === 0) return 0;
  
  // Normalize job title
  const normalizedJobTitle = normalizeJobTitle(jobTitle);
  
  // Check if any past job titles are similar to the target job
  let maxScore = 0;
  for (const job of experience) {
    if (job.title) {
      const normalizedPastTitle = normalizeJobTitle(job.title);
      const similarity = calculateTitleSimilarity(normalizedPastTitle, normalizedJobTitle);
      maxScore = Math.max(maxScore, similarity);
    }
  }
  
  return Math.round(maxScore * 10); // Convert to points out of 10
};

/**
 * Normalize job title for better comparison
 */
const normalizeJobTitle = (title: string): string => {
  return title.toLowerCase()
    .replace(/senior|sr\.|lead|principal|staff|junior|jr\./, '') // Remove seniority
    .replace(/I+|[0-9]+/, '')  // Remove roman numerals and numbers
    .replace(/[-&]/, ' ')      // Replace separators with spaces
    .trim();
};

/**
 * Calculate similarity between two job titles
 * Returns a score between 0 and 1
 */
const calculateTitleSimilarity = (title1: string, title2: string): number => {
  // Direct match check
  if (title1 === title2) return 1.0;
  
  // Check if one is a substring of the other
  if (title1.includes(title2) || title2.includes(title1)) {
    const lengthRatio = Math.min(title1.length, title2.length) / Math.max(title1.length, title2.length);
    return 0.8 * lengthRatio;
  }
  
  // Split into words and check for common words
  const words1 = title1.split(/\s+/);
  const words2 = title2.split(/\s+/);
  
  // Count common words
  const commonWords = words1.filter(word => words2.includes(word));
  
  // Calculate word similarity
  const similarity = commonWords.length * 2 / (words1.length + words2.length);
  return similarity;
};
