
import { ParsedResume } from '../resume/types';
import { toast } from '@/hooks/use-toast';

export interface LinkedInData {
  profileUrl: string;
  connections?: number;
  additionalExperience?: Array<{
    role: string;
    company: string;
    period: string;
  }>;
}

export interface GitHubData {
  username: string;
  repoCount?: number;
  contributions?: number;
  topLanguages?: string[];
}

export interface PublicDataResult {
  linkedin?: LinkedInData;
  github?: GitHubData;
  discrepancies?: Array<{
    type: string;
    description: string;
  }>;
}

/**
 * Aggregates public data from various sources based on resume information
 */
export async function aggregatePublicData(resume: ParsedResume): Promise<PublicDataResult> {
  try {
    // Initialize result
    const result: PublicDataResult = {};
    
    // Start all data collection processes concurrently
    const [linkedInData, githubData, discrepancies] = await Promise.all([
      findLinkedInProfile(resume),
      findGitHubProfile(resume),
      findDiscrepancies(resume)
    ]);
    
    // Add collected data to result
    if (linkedInData) result.linkedin = linkedInData;
    if (githubData) result.github = githubData;
    if (discrepancies && discrepancies.length > 0) result.discrepancies = discrepancies;
    
    return result;
  } catch (error) {
    console.error("Error aggregating public data:", error);
    toast({
      title: "Public Data Aggregation Error",
      description: "Could not retrieve all public data sources.",
      variant: "destructive",
    });
    return {};
  }
}

/**
 * Simulates finding LinkedIn profile based on resume information
 * In a real implementation, this would use APIs or web scraping techniques
 */
async function findLinkedInProfile(resume: ParsedResume): Promise<LinkedInData | undefined> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate simulated LinkedIn data based on the resume
    const name = resume.personalInfo.name.toLowerCase().replace(/\s/g, '');
    
    // Simulate not finding a profile for some candidates
    if (Math.random() > 0.8) {
      return undefined;
    }
    
    // Generate simulated LinkedIn data
    const linkedInData: LinkedInData = {
      profileUrl: `https://linkedin.com/in/${name}-${Math.floor(Math.random() * 999)}`,
      connections: Math.floor(Math.random() * 500) + 100,
    };
    
    // Randomly add additional experience not found in the resume
    if (Math.random() > 0.5) {
      const companies = [
        "Tech Solutions Inc.",
        "Global Innovations",
        "Digital Frontier",
        "NextGen Systems",
        "EcoTech Solutions"
      ];
      
      const roles = [
        "Junior Developer",
        "Intern",
        "Freelance Consultant",
        "Part-time Assistant",
        "Volunteer Coordinator"
      ];
      
      const additionalExperience = [];
      const count = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < count; i++) {
        const startYear = 2010 + Math.floor(Math.random() * 10);
        additionalExperience.push({
          role: roles[Math.floor(Math.random() * roles.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          period: `${startYear} - ${startYear + Math.floor(Math.random() * 2) + 1}`
        });
      }
      
      linkedInData.additionalExperience = additionalExperience;
    }
    
    return linkedInData;
  } catch (error) {
    console.error("Error finding LinkedIn profile:", error);
    return undefined;
  }
}

/**
 * Simulates finding GitHub profile based on resume information
 * In a real implementation, this would use the GitHub API
 */
async function findGitHubProfile(resume: ParsedResume): Promise<GitHubData | undefined> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if resume mentions GitHub or specific programming languages
    const hasGitHubSkill = resume.skills.some(skill => 
      ['github', 'git', 'version control'].some(term => 
        skill.toLowerCase().includes(term)
      )
    );
    
    const hasProgrammingSkills = resume.skills.some(skill => 
      ['java', 'python', 'javascript', 'typescript', 'c#', 'c++', 'ruby', 'go', 'rust', 'php'].some(lang => 
        skill.toLowerCase().includes(lang)
      )
    );
    
    // If no relevant skills, lower chance of finding GitHub profile
    if (!hasGitHubSkill && !hasProgrammingSkills && Math.random() > 0.4) {
      return undefined;
    }
    
    // Generate username based on name
    const name = resume.personalInfo.name.toLowerCase().split(' ')[0];
    const username = `${name}${Math.floor(Math.random() * 9999)}`;
    
    // Generate programming languages based on resume skills
    const programmingLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'Ruby', 'Go', 'Rust', 'C++', 'C#', 'PHP'];
    const topLanguages = [];
    
    // Match languages from resume skills
    for (const skill of resume.skills) {
      const matchedLanguage = programmingLanguages.find(lang => 
        skill.toLowerCase().includes(lang.toLowerCase())
      );
      
      if (matchedLanguage && !topLanguages.includes(matchedLanguage)) {
        topLanguages.push(matchedLanguage);
      }
    }
    
    // Add random languages if needed
    while (topLanguages.length < 3) {
      const randomLang = programmingLanguages[Math.floor(Math.random() * programmingLanguages.length)];
      if (!topLanguages.includes(randomLang)) {
        topLanguages.push(randomLang);
      }
    }
    
    return {
      username,
      repoCount: Math.floor(Math.random() * 50) + 5,
      contributions: Math.floor(Math.random() * 1200) + 100,
      topLanguages: topLanguages.slice(0, Math.floor(Math.random() * 3) + 3)
    };
  } catch (error) {
    console.error("Error finding GitHub profile:", error);
    return undefined;
  }
}

/**
 * Identifies discrepancies between resume and public data
 */
async function findDiscrepancies(resume: ParsedResume): Promise<Array<{type: string, description: string}> | undefined> {
  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const discrepancies = [];
    
    // Simulate random discrepancies for demo purposes
    // In a real implementation, this would compare resume data with collected public data
    
    // 30% chance to find a job title discrepancy
    if (Math.random() < 0.3 && resume.experience.length > 0) {
      const randomJob = resume.experience[Math.floor(Math.random() * resume.experience.length)];
      discrepancies.push({
        type: "job_title",
        description: `Job title discrepancy found for ${randomJob.company}: Resume lists "${randomJob.title}" but public sources indicate a different title.`
      });
    }
    
    // 20% chance to find a employment date discrepancy
    if (Math.random() < 0.2 && resume.experience.length > 0) {
      const randomJob = resume.experience[Math.floor(Math.random() * resume.experience.length)];
      discrepancies.push({
        type: "employment_date",
        description: `Employment date discrepancy for ${randomJob.company}: Resume indicates "${randomJob.period}" but public sources show different dates.`
      });
    }
    
    // 15% chance to find an education discrepancy
    if (Math.random() < 0.15 && resume.education.length > 0) {
      const randomEducation = resume.education[Math.floor(Math.random() * resume.education.length)];
      discrepancies.push({
        type: "education",
        description: `Education verification issue: Could not verify degree "${randomEducation.degree}" from "${randomEducation.institution}".`
      });
    }
    
    return discrepancies.length > 0 ? discrepancies : undefined;
  } catch (error) {
    console.error("Error finding discrepancies:", error);
    return undefined;
  }
}
