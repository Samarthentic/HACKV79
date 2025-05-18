
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';
import llmService from '@/services/llm/llmService';

// Custom hooks
import { useJobFitment } from '@/hooks/useJobFitment';

// Job components
import JobFitmentHeader from '@/components/jobs/JobFitmentHeader';
import JobFitmentContent from '@/components/jobs/JobFitmentContent';
import JobFitmentNavigation from '@/components/jobs/JobFitmentNavigation';
import JobAnalysisLoading from '@/components/jobs/JobAnalysisLoading';
import JobFitmentLlmSetup from '@/components/jobs/JobFitmentLlmSetup';

// Services
import { ParsedResume } from '@/services/resumeParsingService';

const JobFitment = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [isLlmConfigured, setIsLlmConfigured] = useState<boolean>(false);
  const navigate = useNavigate();
  const fitmentContentRef = useRef<HTMLDivElement>(null);

  // Check if LLM service is configured
  useEffect(() => {
    setIsLlmConfigured(llmService.isConfigured());
  }, []);

  const handleBack = () => {
    navigate('/resume-summary');
  };

  const handleLlmConfigured = () => {
    setIsLlmConfigured(true);
  };

  // Get all job fitment data using our custom hook
  const {
    jobMatches,
    isAnalyzing,
    publicData,
    isAggregatingData,
    dossier,
    isGeneratingDossier,
    llmAnalysisData
  } = useJobFitment(resumeData, isLlmConfigured);

  // If LLM is not configured, show setup component
  if (!isLlmConfigured) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <JobFitmentLlmSetup onLlmConfigured={handleLlmConfigured} />
        <Footer />
      </div>
    );
  }

  return (
    <ResumeDataLoader>
      {(loadedData) => {
        // Set the resume data when first loaded
        if (!resumeData) {
          setResumeData(loadedData);
        }
        
        return (
          <div className="min-h-screen flex flex-col">
            <Navbar />
            
            <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
              <JobFitmentHeader />

              <JobAnalysisLoading 
                isAnalyzing={isAnalyzing} 
                isAggregatingData={isAggregatingData} 
                isGeneratingDossier={isGeneratingDossier} 
              />

              <JobFitmentContent 
                resumeData={resumeData}
                jobMatches={jobMatches}
                dossier={dossier}
                llmAnalysisData={llmAnalysisData}
                contentRef={fitmentContentRef}
              />
              
              <JobFitmentNavigation 
                onBack={handleBack} 
                contentRef={fitmentContentRef} 
              />
            </div>
            
            <Footer />
          </div>
        );
      }}
    </ResumeDataLoader>
  );
};

export default JobFitment;
