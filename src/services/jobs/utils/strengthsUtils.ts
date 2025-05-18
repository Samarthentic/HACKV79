
import { ParsedResume } from "../../resume/types";
import { JobMatch } from "../jobMatching";
import { getTopMatchingSkills } from "./skillsUtils";

/**
 * Identify resume strengths based on matching skills
 */
export const getStrengths = (resumeData: ParsedResume | null, jobMatches: JobMatch[]): string[] => {
  if (!resumeData || jobMatches.length === 0) return [];
  
  const strengths: string[] = [];
  
  // Add skill-based strengths
  const topSkills = getTopMatchingSkills(jobMatches, 3);
  if (topSkills.length > 0) {
    strengths.push(`Strong skills in ${topSkills.join(', ')}`);
  }
  
  // Education-based strengths
  if (resumeData.education.length > 0) {
    const highestDegree = resumeData.education[0];
    strengths.push(`Educational background in ${highestDegree.degree} from ${highestDegree.institution}`);
  }
  
  // Experience-based strengths
  if (resumeData.experience.length > 0) {
    strengths.push(`Professional experience at ${resumeData.experience.map(e => e.company).join(', ')}`);
  }
  
  // If we don't have enough strengths, add some generic ones
  if (strengths.length < 3) {
    if (resumeData.skills.length > 5) {
      strengths.push('Diverse skill set applicable to multiple roles');
    }
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      strengths.push('Professional certifications that validate expertise');
    }
  }
  
  return strengths;
};
