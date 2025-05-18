
import { ParsedResume } from "../../resume/types";
import { JobMatch } from "../jobMatchingService";
import { getTopMissingSkills } from "./skillsUtils";

/**
 * Identify areas to improve based on missing skills
 */
export const getAreasToImprove = (resumeData: ParsedResume | null, jobMatches: JobMatch[]): string[] => {
  if (!resumeData || jobMatches.length === 0) return [];
  
  const areasToImprove: string[] = [];
  
  // Find common missing skills in top job matches
  const topMissingSkills = getTopMissingSkills(jobMatches, 3);
  if (topMissingSkills.length > 0) {
    areasToImprove.push(`Consider developing skills in ${topMissingSkills.join(', ')}`);
  }
  
  // Education improvement suggestions
  const requiresHigherDegree = jobMatches.some(match => 
    match.job.description.includes("Master's") || 
    match.job.description.includes("Ph.D")
  );
  
  const hasHigherDegree = resumeData?.education.some(edu => 
    edu.degree.includes("Master") || 
    edu.degree.includes("Ph.D") ||
    edu.degree.includes("M.S.") ||
    edu.degree.includes("M.A.")
  );
  
  if (requiresHigherDegree && !hasHigherDegree) {
    areasToImprove.push('Consider pursuing advanced degrees for higher-level positions');
  }
  
  // Add more improvement areas if needed
  if (areasToImprove.length < 3) {
    areasToImprove.push('Expand your professional network to increase job opportunities');
    if (resumeData?.certifications && resumeData.certifications.length === 0) {
      areasToImprove.push('Obtain industry-relevant certifications to validate your skills');
    }
  }
  
  return areasToImprove;
};
