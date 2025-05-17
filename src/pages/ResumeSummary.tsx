
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParsedResume } from '@/services/resumeParsingService';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';
import ResumePage from '@/components/resume/ResumePage';

const ResumeSummary = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/upload');
  };

  const handleContinue = () => {
    navigate('/job-fitment');
  };

  return (
    <ResumeDataLoader>
      {(loadedData) => {
        // Set the initial data when it's first loaded
        if (!resumeData) {
          setResumeData(loadedData);
        }
        
        return (
          <ResumePage
            resumeData={resumeData || loadedData}
            onResumeDataUpdate={setResumeData}
            onBack={handleBack}
            onContinue={handleContinue}
          />
        );
      }}
    </ResumeDataLoader>
  );
};

export default ResumeSummary;
