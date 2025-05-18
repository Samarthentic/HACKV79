
import { JobMatch } from "../jobMatching";

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
