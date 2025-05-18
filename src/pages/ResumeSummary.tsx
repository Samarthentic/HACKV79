
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParsedResume } from '@/services/resumeParsingService';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';
import ResumePage from '@/components/resume/ResumePage';
import { useLlm } from '@/contexts/LlmContext';
import ApiKeySetup from '@/components/llm/ApiKeySetup';
import llmService from '@/services/llm/llmService';
import { toast } from '@/hooks/use-toast';
import { aggregatePublicData, PublicDataResult } from '@/services/publicData/aggregationService';

const ResumeSummary = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [originalData, setOriginalData] = useState<ParsedResume | null>(null);
  const [showLlmSetup, setShowLlmSetup] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [publicData, setPublicData] = useState<PublicDataResult | undefined>(undefined);
  const [isAggregatingData, setIsAggregatingData] = useState(false);
  const { isConfigured } = useLlm();
  const navigate = useNavigate();

  useEffect(() => {
    // If LLM is configured, we can potentially enhance the resume later
    if (isConfigured && originalData && !isEnhancing) {
      enhanceResume(originalData);
    }
  }, [isConfigured, originalData]);

  useEffect(() => {
    // Aggregate public data when resume data is loaded
    if (resumeData && !publicData && !isAggregatingData) {
      fetchPublicData(resumeData);
    }
  }, [resumeData, publicData, isAggregatingData]);

  const fetchPublicData = async (data: ParsedResume) => {
    try {
      setIsAggregatingData(true);
      toast({
        title: "Aggregating Public Data",
        description: "Searching for public information about the candidate...",
      });
      
      const result = await aggregatePublicData(data);
      setPublicData(result);
      
      // Show toast based on results
      if (Object.keys(result).length > 0) {
        const sources = Object.keys(result).filter(k => k !== 'discrepancies').join(' and ');
        if (sources) {
          toast({
            title: "Public Data Found",
            description: `Found data from ${sources} for enhanced candidate evaluation.`,
          });
        }
        
        if (result.discrepancies && result.discrepancies.length > 0) {
          toast({
            title: "Discrepancies Detected",
            description: `Found ${result.discrepancies.length} potential discrepancies in candidate information.`,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error aggregating public data:", error);
      toast({
        title: "Data Aggregation Error",
        description: "Could not retrieve public data for this candidate.",
        variant: "destructive",
      });
    } finally {
      setIsAggregatingData(false);
    }
  };

  const enhanceResume = async (data: ParsedResume) => {
    if (!isConfigured || !data || isEnhancing) return;
    
    setIsEnhancing(true);
    try {
      // Get the raw text from localStorage if available (for better enhancement)
      const resumeText = localStorage.getItem('resumeRawText') || '';
      
      toast({
        title: "AI Enhancement Started",
        description: "Improving your resume with advanced AI analysis...",
      });
      
      // Enhance the resume with LLM
      const enhancedData = await llmService.enhanceResumeExtraction(
        resumeText, 
        data
      );
      
      // Update the resume data with the enhanced version
      setResumeData({
        ...data,
        ...enhancedData
      });
      
      toast({
        title: "Resume Enhanced",
        description: "AI has improved your resume analysis for better job matching",
      });
    } catch (error) {
      console.error("Error enhancing resume:", error);
      toast({
        title: "Enhancement Error",
        description: "Could not enhance resume with AI. Using standard analysis.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleBack = () => {
    navigate('/upload');
  };

  const handleContinue = () => {
    navigate('/job-fitment');
  };

  const handleLlmConfigured = () => {
    setShowLlmSetup(false);
    if (originalData) {
      enhanceResume(originalData);
    }
  };

  const handleEnableAI = () => {
    setShowLlmSetup(true);
  };

  return (
    <ResumeDataLoader>
      {(loadedData) => {
        // Store the original data when first loaded
        if (!originalData) {
          setOriginalData(loadedData);
          // If no data is set yet, use the loaded data
          if (!resumeData) {
            setResumeData(loadedData);
          }
        }
        
        // Show LLM setup if requested
        if (showLlmSetup) {
          return (
            <div className="container mx-auto max-w-4xl py-10">
              <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Enable AI Enhancement</h1>
              <p className="text-gray-600 mb-8">
                Configure AI integration to get an enhanced resume analysis.
              </p>
              
              <ApiKeySetup onConfigured={handleLlmConfigured} />
              
              <div className="mt-8 flex justify-between">
                <button 
                  onClick={() => setShowLlmSetup(false)}
                  className="text-gray-500 underline"
                >
                  Continue without AI
                </button>
              </div>
            </div>
          );
        }
        
        return (
          <ResumePage
            resumeData={resumeData || loadedData}
            onResumeDataUpdate={setResumeData}
            onBack={handleBack}
            onContinue={handleContinue}
            isLlmConfigured={isConfigured}
            isEnhancing={isEnhancing}
            onEnableAI={handleEnableAI}
            publicData={publicData}
          />
        );
      }}
    </ResumeDataLoader>
  );
};

export default ResumeSummary;
