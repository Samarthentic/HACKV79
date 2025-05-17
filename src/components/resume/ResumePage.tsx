
import React from 'react';
import { ParsedResume } from '@/services/resumeParsingService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeNavigation from './ResumeNavigation';
import ResumeContent from './ResumeContent';

interface ResumePageProps {
  resumeData: ParsedResume;
  onResumeDataUpdate: (updatedData: ParsedResume) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ResumePage: React.FC<ResumePageProps> = ({
  resumeData,
  onResumeDataUpdate,
  onBack,
  onContinue
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        <ResumeContent 
          resumeData={resumeData} 
          onResumeDataUpdate={onResumeDataUpdate} 
        />

        <ResumeNavigation onBack={onBack} onContinue={onContinue} />
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumePage;
