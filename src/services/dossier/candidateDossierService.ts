
import { ParsedResume } from '../resume/types';
import { JobMatch } from '../jobs/jobMatchingService';
import { PublicDataResult } from '../publicData/aggregationService';
import llmService from '../llm/llmService';
import { toast } from '@/hooks/use-toast';

export interface CandidateDossier {
  summary: string;
  keyStrengths: string[];
  fitmentScore: number;
  careerTrajectory: {
    path: string;
    growthAreas: string[];
    recommendations: string[];
  };
  redFlags: Array<{
    severity: 'high' | 'medium' | 'low';
    issue: string;
    impact: string;
  }>;
}

/**
 * Generates a comprehensive candidate dossier based on resume, job matches and public data
 */
export async function generateCandidateDossier(
  resume: ParsedResume,
  jobMatches: JobMatch[],
  publicData?: PublicDataResult
): Promise<CandidateDossier | null> {
  try {
    // Check if LLM service is configured
    if (!llmService.isConfigured()) {
      console.log("LLM service not configured, using basic dossier");
      return generateBasicDossier(resume, jobMatches, publicData);
    }
    
    toast({
      title: "Generating Candidate Dossier",
      description: "Using AI to create a comprehensive candidate profile...",
    });
    
    console.log("Generating AI-enhanced candidate dossier...");
    
    // Use LLM to generate enhanced dossier
    try {
      const llmDossier = await llmService.analyzeJobFitment(resume, jobMatches.slice(0, 3));
      
      // Build the dossier structure
      const dossier: CandidateDossier = {
        summary: generateCandidateSummary(resume, publicData),
        keyStrengths: llmDossier.strengths || generateKeyStrengths(resume, jobMatches),
        fitmentScore: calculateOverallFitmentScore(jobMatches),
        careerTrajectory: {
          path: generateCareerPath(resume),
          growthAreas: llmDossier.areasToImprove || generateGrowthAreas(resume, jobMatches),
          recommendations: generateCareerRecommendations(resume, jobMatches)
        },
        redFlags: llmDossier.redFlags || generateRedFlags(resume, publicData)
      };
      
      return dossier;
    } catch (llmError) {
      console.error("Error using LLM for dossier generation:", llmError);
      return generateBasicDossier(resume, jobMatches, publicData);
    }
  } catch (error) {
    console.error("Error generating candidate dossier:", error);
    toast({
      title: "Dossier Generation Error",
      description: "Could not generate the candidate dossier.",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Generate a basic dossier without LLM enhancement
 */
function generateBasicDossier(
  resume: ParsedResume,
  jobMatches: JobMatch[],
  publicData?: PublicDataResult
): CandidateDossier {
  return {
    summary: generateCandidateSummary(resume, publicData),
    keyStrengths: generateKeyStrengths(resume, jobMatches),
    fitmentScore: calculateOverallFitmentScore(jobMatches),
    careerTrajectory: {
      path: generateCareerPath(resume),
      growthAreas: generateGrowthAreas(resume, jobMatches),
      recommendations: generateCareerRecommendations(resume, jobMatches)
    },
    redFlags: generateRedFlags(resume, publicData)
  };
}

/**
 * Generate a summary of the candidate
 */
function generateCandidateSummary(resume: ParsedResume, publicData?: PublicDataResult): string {
  const experience = resume.experience.length > 0 
    ? resume.experience.length === 1 
      ? `1 job position` 
      : `${resume.experience.length} job positions`
    : "no documented work experience";
  
  const education = resume.education.length > 0 
    ? `educated with ${resume.education.length === 1 ? 'a ' : ''}${resume.education.map(e => e.degree).join(', ')}` 
    : "no formal education listed";
  
  const skills = resume.skills.length > 0 
    ? `${resume.skills.length} skills including ${resume.skills.slice(0, 3).join(', ')}${resume.skills.length > 3 ? ', and more' : ''}` 
    : "no specified skills";
  
  const publicDataInfo = publicData && Object.keys(publicData).length > 0 
    ? ` with verified public profiles on ${Object.keys(publicData).filter(k => k !== 'discrepancies').join(' and ')}` 
    : "";
  
  return `${resume.personalInfo.name} is a candidate with ${experience}, ${education}, and ${skills}${publicDataInfo}.`;
}

/**
 * Generate key strengths based on resume and job matches
 */
function generateKeyStrengths(resume: ParsedResume, jobMatches: JobMatch[]): string[] {
  const strengths = [];
  
  // Get the most common matching skills across all job matches
  const skillFrequency = new Map<string, number>();
  
  jobMatches.forEach(match => {
    match.matchingSkills.forEach(skill => {
      skillFrequency.set(skill, (skillFrequency.get(skill) || 0) + 1);
    });
  });
  
  // Add top skills as strengths
  const topSkills = Array.from(skillFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => `Strong ${skill} abilities`);
  
  strengths.push(...topSkills);
  
  // Add experience-based strengths
  if (resume.experience.length > 3) {
    strengths.push("Extensive work history demonstrating career progression");
  }
  
  if (resume.experience.some(exp => exp.title.toLowerCase().includes("lead") || 
                              exp.title.toLowerCase().includes("senior") || 
                              exp.title.toLowerCase().includes("manager"))) {
    strengths.push("Leadership experience in previous roles");
  }
  
  // Add education-based strengths
  if (resume.education.some(edu => edu.degree.toLowerCase().includes("master") || 
                             edu.degree.toLowerCase().includes("phd") || 
                             edu.degree.toLowerCase().includes("doctorate"))) {
    strengths.push("Advanced educational qualifications");
  }
  
  // Add certification-based strengths
  if (resume.certifications && resume.certifications.length > 0) {
    strengths.push("Professional certifications demonstrating commitment to skill development");
  }
  
  // If we don't have enough strengths, add some generic ones based on skills
  while (strengths.length < 5) {
    const genericStrengths = [
      "Adaptable to changing work requirements",
      "Effective problem-solving capabilities",
      "Strong communication abilities",
      "Team collaboration skills",
      "Detail-oriented approach to tasks",
      "Project management capabilities"
    ];
    
    const nextStrength = genericStrengths[strengths.length % genericStrengths.length];
    if (!strengths.includes(nextStrength)) {
      strengths.push(nextStrength);
    } else {
      break;
    }
  }
  
  return strengths;
}

/**
 * Calculate an overall fitment score based on job matches
 */
function calculateOverallFitmentScore(jobMatches: JobMatch[]): number {
  if (jobMatches.length === 0) {
    return 50; // Default score
  }
  
  // Take the average of the top 3 job match scores
  const topMatches = jobMatches.slice(0, 3);
  const sum = topMatches.reduce((total, match) => total + match.fitPercentage, 0);
  return Math.round(sum / topMatches.length);
}

/**
 * Generate a career path based on the resume
 */
function generateCareerPath(resume: ParsedResume): string {
  // Get the most recent job title
  const currentRole = resume.experience && resume.experience.length > 0 
    ? resume.experience[0].title 
    : "Entry Level Position";
  
  // Get the most common skills
  const skills = resume.skills.slice(0, 5);
  
  // Map of potential career paths based on common roles and skills
  const careerPaths: Record<string, string> = {
    "developer": "Software Engineer → Senior Developer → Tech Lead → Engineering Manager → CTO",
    "engineer": "Engineer → Senior Engineer → Engineering Lead → Director of Engineering → VP of Engineering",
    "designer": "Designer → Senior Designer → Design Lead → Creative Director → VP of Design",
    "manager": "Manager → Senior Manager → Director → VP → C-level Executive",
    "analyst": "Analyst → Senior Analyst → Team Lead → Manager → Director of Analytics",
    "marketing": "Marketing Specialist → Marketing Manager → Senior Marketing Manager → Marketing Director → CMO",
    "sales": "Sales Representative → Account Manager → Sales Manager → Sales Director → VP of Sales",
    "finance": "Financial Analyst → Senior Financial Analyst → Finance Manager → Finance Director → CFO",
    "human resources": "HR Specialist → HR Manager → HR Director → VP of HR → CHRO",
    "product": "Product Specialist → Product Manager → Senior Product Manager → Product Director → CPO",
    "data": "Data Analyst → Data Scientist → Senior Data Scientist → Data Science Manager → Chief Data Officer"
  };
  
  // Try to match the current role to a career path
  for (const [keyword, path] of Object.entries(careerPaths)) {
    if (currentRole.toLowerCase().includes(keyword)) {
      return path;
    }
  }
  
  // Try to match skills to a career path
  for (const skill of skills) {
    for (const [keyword, path] of Object.entries(careerPaths)) {
      if (skill.toLowerCase().includes(keyword)) {
        return path;
      }
    }
  }
  
  // Default career path
  return "Entry Position → Specialist → Team Lead → Manager → Director → Executive";
}

/**
 * Generate growth areas based on resume and job matches
 */
function generateGrowthAreas(resume: ParsedResume, jobMatches: JobMatch[]): string[] {
  const growthAreas = [];
  
  // Identify missing skills from job matches
  const missingSkillFrequency = new Map<string, number>();
  
  jobMatches.forEach(match => {
    match.missingSkills.forEach(skill => {
      missingSkillFrequency.set(skill, (missingSkillFrequency.get(skill) || 0) + 1);
    });
  });
  
  // Add top missing skills as growth areas
  const topMissingSkills = Array.from(missingSkillFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => `Develop skills in ${skill}`);
  
  growthAreas.push(...topMissingSkills);
  
  // Check for education gaps
  if (resume.education.length === 0) {
    growthAreas.push("Pursue formal education or certifications");
  } else if (!resume.education.some(edu => 
    edu.degree.toLowerCase().includes("bachelor") || 
    edu.degree.toLowerCase().includes("master") || 
    edu.degree.toLowerCase().includes("phd"))) {
    growthAreas.push("Consider pursuing higher education to enhance qualifications");
  }
  
  // Check for experience gaps
  if (resume.experience.length < 2) {
    growthAreas.push("Gain more diverse work experience");
  }
  
  // Check for certification gaps
  if (!resume.certifications || resume.certifications.length === 0) {
    growthAreas.push("Obtain industry-relevant certifications");
  }
  
  return growthAreas;
}

/**
 * Generate career recommendations based on resume and job matches
 */
function generateCareerRecommendations(resume: ParsedResume, jobMatches: JobMatch[]): string[] {
  const recommendations = [];
  
  // Recommend based on job matches
  if (jobMatches.length > 0) {
    const topJobMatch = jobMatches[0];
    recommendations.push(`Focus on roles similar to "${topJobMatch.job.title}" which has a ${topJobMatch.fitPercentage}% match to your profile`);
  }
  
  // Recommend based on skills
  if (resume.skills.length > 0) {
    const topSkills = resume.skills.slice(0, 3);
    recommendations.push(`Leverage your strengths in ${topSkills.join(', ')} when pursuing new opportunities`);
  }
  
  // Recommend based on experience
  if (resume.experience.length > 0) {
    const mostRecentRole = resume.experience[0].title;
    recommendations.push(`Seek advancement opportunities that build upon your experience as ${mostRecentRole}`);
  }
  
  // Add generic recommendations if needed
  const genericRecommendations = [
    "Expand your professional network through industry events and online communities",
    "Create a portfolio to showcase your projects and achievements",
    "Consider freelance or contract work to diversify your experience",
    "Pursue mentorship opportunities with industry experts",
    "Participate in open-source projects or volunteering to gain additional experience"
  ];
  
  while (recommendations.length < 3) {
    const nextRec = genericRecommendations[recommendations.length % genericRecommendations.length];
    if (!recommendations.includes(nextRec)) {
      recommendations.push(nextRec);
    } else {
      break;
    }
  }
  
  return recommendations;
}

/**
 * Generate red flags based on resume and public data
 */
function generateRedFlags(resume: ParsedResume, publicData?: PublicDataResult): Array<{severity: 'high' | 'medium' | 'low'; issue: string; impact: string;}> {
  const redFlags = [];
  
  // Add discrepancies from public data as high-severity red flags
  if (publicData?.discrepancies) {
    publicData.discrepancies.forEach(discrepancy => {
      let severity: 'high' | 'medium' | 'low' = 'medium';
      let impact = '';
      
      switch (discrepancy.type) {
        case 'job_title':
          severity = 'high';
          impact = 'Job title inconsistencies may indicate resume inflation and affect credibility with employers.';
          break;
        case 'employment_date':
          severity = 'medium';
          impact = 'Employment date discrepancies could suggest gaps in employment history or inaccurate reporting.';
          break;
        case 'education':
          severity = 'high';
          impact = 'Unverifiable education credentials may be seen as misrepresentation and cause immediate disqualification.';
          break;
        default:
          severity = 'medium';
          impact = 'Inconsistencies between resume and public data raise concerns about accuracy of candidate information.';
      }
      
      redFlags.push({
        severity,
        issue: discrepancy.description,
        impact
      });
    });
  }
  
  // Check for resume quality issues
  if (resume.skills.length < 5) {
    redFlags.push({
      severity: 'medium',
      issue: 'Limited skills listed on resume',
      impact: 'Inadequate skill representation may lead to missed job matches and lower ranking in applicant tracking systems.'
    });
  }
  
  if (resume.experience.some(exp => !exp.description || exp.description.length < 50)) {
    redFlags.push({
      severity: 'low',
      issue: 'Insufficient job descriptions for some positions',
      impact: 'Lack of detailed job descriptions makes it difficult for employers to assess actual contributions and achievements.'
    });
  }
  
  // Check for employment gaps
  if (resume.experience.length >= 2) {
    for (let i = 0; i < resume.experience.length - 1; i++) {
      const currentJob = resume.experience[i];
      const nextJob = resume.experience[i + 1];
      
      if (currentJob.period && nextJob.period) {
        const currentEndMatch = currentJob.period.match(/(\d{4})$/);
        const nextStartMatch = nextJob.period.match(/^(\d{4})/);
        
        if (currentEndMatch && nextStartMatch) {
          const currentEnd = parseInt(currentEndMatch[1], 10);
          const nextStart = parseInt(nextStartMatch[1], 10);
          
          if (currentEnd - nextStart >= 2) {
            redFlags.push({
              severity: 'medium',
              issue: `Employment gap of ${currentEnd - nextStart} years between roles`,
              impact: 'Significant employment gaps may raise questions for employers about career consistency and commitment.'
            });
          }
        }
      }
    }
  }
  
  return redFlags;
}
