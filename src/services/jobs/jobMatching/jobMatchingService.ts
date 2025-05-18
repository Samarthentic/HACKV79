
import { ParsedResume } from '../../resume/types';
import { JobListing } from '../jobsData';
import { JobMatch } from './types';
import { extractJobSkills, extractJobKeywords } from './skillExtraction';
import { hasMatchingSkill } from './skillMatching';
import { calculateEducationBonus } from './educationUtils';
import { calculateExperienceBonus } from './experienceUtils';
import { calculateKeywordBonus, calculateJobRelevance } from './relevanceUtils';

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
    const educationBonus = calculateEducationBonus(resume, job.description);
    const experienceBonus = calculateExperienceBonus(resume, job.description);
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
