
import { ParsedResume } from '../../resume/types';

/**
 * Calculate bonus for matching important job keywords
 */
export const calculateKeywordBonus = (resume: ParsedResume, jobKeywords: string[]): number => {
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
export const calculateJobRelevance = (experience: Array<any>, jobTitle: string): number => {
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
export const normalizeJobTitle = (title: string): string => {
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
export const calculateTitleSimilarity = (title1: string, title2: string): number => {
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
