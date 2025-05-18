
import { JobMatch } from "../jobMatchingService";

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
