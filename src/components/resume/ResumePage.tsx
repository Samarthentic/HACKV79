
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
  isLlmConfigured?: boolean;
  isEnhancing?: boolean;
  onEnableAI?: () => void;
}

const ResumePage: React.FC<ResumePageProps> = ({
  resumeData,
  onResumeDataUpdate,
  onBack,
  onContinue,
  isLlmConfigured,
  isEnhancing,
  onEnableAI
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        {isLlmConfigured === false && onEnableAI && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-medium text-blue-800">Enable AI Enhancement</h3>
            <p className="text-blue-600 mb-3">
              Get more accurate resume analysis with our AI assistant.
            </p>
            <button 
              onClick={onEnableAI}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Enable AI Analysis
            </button>
          </div>
        )}
        
        {isEnhancing && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700 mr-3"></div>
            <p className="text-amber-700">AI is enhancing your resume analysis...</p>
          </div>
        )}

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
