
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
    console.log(`Job ${job.title} skills:`, jobSkills);
    
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];
    
    // Find matching skills
    for (const skill of jobSkills) {
      if (hasMatchingSkill(resume.skills, skill)) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }
    
    // Calculate match percentage
    let fitPercentage = 0;
    if (jobSkills.length > 0) {
      fitPercentage = Math.round((matchingSkills.length / jobSkills.length) * 100);
    }
    
    // Apply education and experience bonus
    const educationBonus = calculateEducationBonus(resume, job);
    const experienceBonus = calculateExperienceBonus(resume, job);
    
    fitPercentage = Math.min(100, fitPercentage + educationBonus + experienceBonus);
    
    console.log(`${job.title} match: ${fitPercentage}%, Matching: ${matchingSkills.length}, Missing: ${missingSkills.length}`);
    
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
 * Extract key skills from a job description
 */
const extractJobSkills = (description: string): string[] => {
  const skills = new Set<string>();
  
  // Common skill keywords to look for
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
 * Check if resume skills contain a matching skill
 */
const hasMatchingSkill = (resumeSkills: string[], jobSkill: string): boolean => {
  const normalizedJobSkill = jobSkill.toLowerCase();
  
  return resumeSkills.some(skill => {
    const normalizedResumeSkill = skill.toLowerCase();
    return (
      normalizedResumeSkill.includes(normalizedJobSkill) || 
      normalizedJobSkill.includes(normalizedResumeSkill)
    );
  });
};

/**
 * Calculate education bonus based on degree requirements
 */
const calculateEducationBonus = (resume: ParsedResume, job: JobListing): number => {
  // Check if job requires a degree
  const requiresDegree = job.description.includes("Bachelor's") || 
                        job.description.includes("Master's") ||
                        job.description.includes("Ph.D") ||
                        job.description.includes("Degree");
  
  // Check if resume has a degree                      
  const hasDegree = resume.education.some(edu => 
    edu.degree.includes("Bachelor") || 
    edu.degree.includes("Master") || 
    edu.degree.includes("Ph.D") ||
    edu.degree.includes("B.S.") ||
    edu.degree.includes("M.S.") ||
    edu.degree.includes("B.A.") ||
    edu.degree.includes("M.A.")
  );
  
  // Bonus for having a degree when required
  return (requiresDegree && hasDegree) ? 10 : 0;
};

/**
 * Calculate experience bonus based on years and relevance
 */
const calculateExperienceBonus = (resume: ParsedResume, job: JobListing): number => {
  // Simple implementation - could be enhanced with more sophisticated matching
  if (resume.experience.length >= 3) {
    return 5; // Bonus for having multiple experiences
  } else if (resume.experience.length > 0) {
    return 2; // Small bonus for having at least one experience
  }
  
  return 0;
};
