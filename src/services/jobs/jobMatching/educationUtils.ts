
import { ParsedResume } from '../../resume/types';
import { extractFieldsOfStudy } from './skillExtraction';

/**
 * Calculate education bonus based on degree requirements with improved matching
 */
export const calculateEducationBonus = (resume: ParsedResume, jobDescription: string): number => {
  // Extract degree requirements from job description
  const requiresAssociate = jobDescription.includes("Associate") || jobDescription.includes("2-year degree");
  const requiresBachelors = jobDescription.includes("Bachelor") || 
                          jobDescription.includes("B.S.") || 
                          jobDescription.includes("B.A.");
  const requiresMasters = jobDescription.includes("Master") || 
                        jobDescription.includes("M.S.") || 
                        jobDescription.includes("M.A.");
  const requiresPhD = jobDescription.includes("Ph.D") || 
                    jobDescription.includes("Doctorate") || 
                    jobDescription.includes("Doctoral");
  
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
  const jobFields = extractFieldsOfStudy(jobDescription);
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
