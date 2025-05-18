
import { ParsedResume } from '../../resume/types';

/**
 * Calculate experience bonus based on years and relevance with improved matching
 */
export const calculateExperienceBonus = (resume: ParsedResume, jobDescription: string): number => {
  // Extract required years from job description
  const yearsRequired = extractYearsRequired(jobDescription);
  
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
  if (hasRelevantIndustryExperience(resume.experience, jobDescription)) {
    bonus += 5;
  }
  
  return bonus;
};

/**
 * Extract years of experience required from job description
 */
export const extractYearsRequired = (description: string): number => {
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
export const estimateYearsOfExperience = (experience: Array<any>): number => {
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
export const extractYearsFromPeriod = (period: string): number => {
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
export const hasRelevantIndustryExperience = (experience: Array<any>, jobDescription: string): boolean => {
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
