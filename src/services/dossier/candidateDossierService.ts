import { ParsedResume } from '../resumeParsingService';
import { JobMatch } from '../jobs/jobMatchingService';

export type CandidateDossier = {
  summary: string;
  fitmentScore: number;
  keyStrengths: string[];
  redFlags: Array<{
    severity: "high" | "medium" | "low";
    issue: string;
    impact: string;
  }>;
  careerTrajectory: {
    path: string;
    growthAreas: string[];
    recommendations: string[];
  };
  dataRelations: {
    [key: string]: any;
  };
};

// Mock functions (replace with actual implementations later)
const generateSummary = (resumeData: ParsedResume, jobMatches: JobMatch[], publicData: any): string => {
  return `A highly motivated candidate with ${resumeData.skills?.length || 0} skills and experience in ${resumeData.experience?.[0]?.company || 'various companies'}.`;
};

const calculateFitmentScore = (jobMatches: JobMatch[]): number => {
  return Math.floor(Math.random() * 100);
};

const extractKeyStrengths = (resumeData: ParsedResume, jobMatches: JobMatch[]): string[] => {
  return resumeData.skills?.slice(0, 5) || ['Adaptability', 'Teamwork', 'Problem-solving'];
};

const identifyRedFlags = (resumeData: ParsedResume): Array<{severity: string; issue: string; impact: string;}> => {
  return [
    { severity: 'medium', issue: 'Inconsistent job history', impact: 'May indicate job hopping' },
    { severity: 'low', issue: 'Skills not up-to-date', impact: 'Might require additional training' },
  ];
};

const defineCareerTrajectory = (): {path: string; growthAreas: string[]; recommendations: string[];} => {
  return {
    path: 'Entry Level → Mid Level → Senior Level',
    growthAreas: ['Leadership', 'Strategic Planning', 'Communication'],
    recommendations: ['Take leadership courses', 'Attend industry conferences', 'Network with senior professionals'],
  };
};

const establishDataRelations = (resumeData: ParsedResume, publicData: any): {[key: string]: any} => {
  return {
    resumeSkills: resumeData.skills,
    publicDataInsights: publicData,
  };
};

export const generateCandidateDossier = async (
  resumeData: ParsedResume,
  jobMatches: JobMatch[],
  publicData: any
): Promise<CandidateDossier | null> => {
  try {
    const summary = generateSummary(resumeData, jobMatches, publicData);
    const fitmentScore = calculateFitmentScore(jobMatches);
    const keyStrengths = extractKeyStrengths(resumeData, jobMatches);
    const redFlags = identifyRedFlags(resumeData);
    const careerTrajectory = defineCareerTrajectory();
    const dataRelations = establishDataRelations(resumeData, publicData);

    // Normalize red flags to ensure they have the correct severity type
    const processedRedFlags = redFlags.map(flag => {
      // Ensure severity is one of the allowed literal types
      let normalizedSeverity: "high" | "medium" | "low" = "medium";
      if (flag.severity === "high") normalizedSeverity = "high";
      if (flag.severity === "low") normalizedSeverity = "low";
      
      return {
        ...flag,
        severity: normalizedSeverity
      };
    });

    // Create and return the dossier with properly typed red flags
    const dossier: CandidateDossier = {
      summary,
      fitmentScore,
      keyStrengths,
      redFlags: processedRedFlags,
      careerTrajectory,
      dataRelations
    };

    return dossier;
  } catch (error) {
    console.error('Error generating candidate dossier:', error);
    return null;
  }
};

// Helper functions (can be moved to a separate utility file if needed)
// Example: Function to normalize text, validate data, etc.
