
import { ParsedResume } from "@/services/resumeParsingService";
import { JobMatch } from "./jobMatchingService";

/**
 * Calculate overall score based on top matches
 */
export const getOverallScore = (jobMatches: JobMatch[]): number => {
  if (jobMatches.length === 0) return 0;
  
  // Take average of top 5 matches, or all if less than 5
  const topMatches = jobMatches.slice(0, Math.min(5, jobMatches.length));
  const total = topMatches.reduce((sum, match) => sum + match.fitPercentage, 0);
  return Math.round(total / topMatches.length);
};

/**
 * Get appropriate color based on score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  if (score >= 60) return "text-orange-500";
  return "text-red-500";
};

/**
 * Get appropriate color based on severity
 */
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "high": return "text-red-600";
    case "medium": return "text-orange-500";
    case "low": return "text-yellow-500";
    default: return "text-gray-500";
  }
};

/**
 * Get top matching skills across all job matches
 */
export const getTopMatchingSkills = (jobMatches: JobMatch[], count: number): string[] => {
  if (jobMatches.length === 0) return [];
  
  // Count occurrences of each matching skill
  const skillCounts: Record<string, number> = {};
  jobMatches.forEach(match => {
    match.matchingSkills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  
  // Sort skills by occurrence count
  return Object.keys(skillCounts)
    .sort((a, b) => skillCounts[b] - skillCounts[a])
    .slice(0, count);
};

/**
 * Get top missing skills across all job matches
 */
export const getTopMissingSkills = (jobMatches: JobMatch[], count: number): string[] => {
  if (jobMatches.length === 0) return [];
  
  // Count occurrences of each missing skill in top matches
  const skillCounts: Record<string, number> = {};
  jobMatches.slice(0, 5).forEach(match => {
    match.missingSkills.forEach(skill => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });
  
  // Sort skills by occurrence count
  return Object.keys(skillCounts)
    .sort((a, b) => skillCounts[b] - skillCounts[a])
    .slice(0, count);
};

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

/**
 * Identify resume red flags
 */
export const getRedFlags = (resumeData: ParsedResume | null): Array<{severity: string, issue: string, impact: string}> => {
  if (!resumeData) return [];
  
  const redFlags = [];
  
  // Check for missing contact information
  if (!resumeData.personalInfo.email) {
    redFlags.push({
      severity: "high",
      issue: "Missing email address",
      impact: "Recruiters won't be able to contact you"
    });
  }
  
  if (!resumeData.personalInfo.phone) {
    redFlags.push({
      severity: "medium",
      issue: "Missing phone number",
      impact: "Limited contact options for employers"
    });
  }
  
  // Check for missing key sections
  if (resumeData.skills.length === 0) {
    redFlags.push({
      severity: "high",
      issue: "No skills listed in resume",
      impact: "Difficult for employers to assess your capabilities"
    });
  }
  
  if (resumeData.education.length === 0) {
    redFlags.push({
      severity: "medium",
      issue: "No education history in resume",
      impact: "Many positions require specific educational background"
    });
  }
  
  if (resumeData.experience.length === 0) {
    redFlags.push({
      severity: "high",
      issue: "No work experience listed",
      impact: "Employers value demonstrated practical experience"
    });
  }
  
  // Check for skill gaps compared to job market
  const missingInDemandSkills = getTopMissingSkills([], 3); // This would need actual job matches
  if (missingInDemandSkills.length > 0) {
    redFlags.push({
      severity: "medium",
      issue: `Missing in-demand skills: ${missingInDemandSkills.join(', ')}`,
      impact: "These skills appear frequently in job listings"
    });
  }
  
  return redFlags;
};
