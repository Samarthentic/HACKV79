
import React from 'react';
import { ParsedResume } from '@/services/resumeParsingService';
import { JobMatch } from '@/services/jobs/jobMatchingService';
import { CandidateDossier } from '@/services/dossier/candidateDossierService';
import { getOverallScore, getStrengths, getAreasToImprove, getRedFlags } from '@/services/jobs/jobAnalysisUtils';

// Components
import ScoreCard from '@/components/jobs/ScoreCard';
import StrengthsCard from '@/components/jobs/StrengthsCard';
import AreasToImproveCard from '@/components/jobs/AreasToImproveCard';
import RedFlagsTable from '@/components/jobs/RedFlagsTable';
import JobMatchesCard from '@/components/jobs/JobMatchesCard';
import CandidateDossierCard from '@/components/jobs/CandidateDossierCard';

interface JobFitmentContentProps {
  resumeData: ParsedResume | null;
  jobMatches: JobMatch[];
  dossier: CandidateDossier | null;
  llmAnalysisData: {
    strengths: string[];
    areasToImprove: string[];
    redFlags: Array<{severity: "high" | "medium" | "low"; issue: string; impact: string;}>;
  } | null;
  contentRef: React.RefObject<HTMLDivElement>;
}

const JobFitmentContent: React.FC<JobFitmentContentProps> = ({
  resumeData,
  jobMatches,
  dossier,
  llmAnalysisData,
  contentRef
}) => {
  return (
    <div id="fitment-content" ref={contentRef}>
      {dossier && (
        <CandidateDossierCard dossier={dossier} />
      )}
      
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Overall Score */}
        <ScoreCard score={dossier?.fitmentScore || getOverallScore(jobMatches)} />
        
        {/* Strengths */}
        <StrengthsCard 
          strengths={dossier?.keyStrengths || llmAnalysisData?.strengths || getStrengths(resumeData, jobMatches)} 
        />
      </div>
      
      {/* Matching Roles */}
      <JobMatchesCard matches={jobMatches} />
      
      {/* Red Flags */}
      <RedFlagsTable 
        redFlags={dossier?.redFlags || llmAnalysisData?.redFlags || getRedFlags(resumeData)} 
      />
      
      {/* Areas to Improve */}
      <AreasToImproveCard 
        areas={dossier?.careerTrajectory.growthAreas || llmAnalysisData?.areasToImprove || getAreasToImprove(resumeData, jobMatches)} 
      />
    </div>
  );
};

export default JobFitmentContent;
