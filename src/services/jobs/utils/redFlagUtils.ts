
import { ParsedResume } from "../../resume/types";

export interface ResumeRedFlag {
  severity: "high" | "medium" | "low";
  issue: string;
  impact: string;
}

/**
 * Identify resume red flags
 */
export const getRedFlags = (resumeData: ParsedResume | null): ResumeRedFlag[] => {
  if (!resumeData) return [];
  
  const redFlags: ResumeRedFlag[] = [];
  
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
  
  return redFlags;
};
