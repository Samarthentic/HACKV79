
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ParsedResume } from '@/services/resumeParsingService';
import { jobsData } from '@/services/jobs/jobsData';
import { calculateJobMatches, JobMatch } from '@/services/jobs/jobMatchingService';
import { aggregatePublicData } from '@/services/publicData/aggregationService';
import { generateCandidateDossier, CandidateDossier } from '@/services/dossier/candidateDossierService';
import llmService, { LlmAnalysisData } from '@/services/llm/llmService';

export const useJobFitment = (resumeData: ParsedResume | null, isLlmConfigured: boolean) => {
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<any | null>(null);
  const [isAggregatingData, setIsAggregatingData] = useState<boolean>(false);
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isGeneratingDossier, setIsGeneratingDossier] = useState<boolean>(false);
  const [llmAnalysisData, setLlmAnalysisData] = useState<LlmAnalysisData | null>(null);
  
  // Calculate job matches when resume data is available
  useEffect(() => {
    if (resumeData) {
      // Calculate job matches
      const matches = calculateJobMatches(resumeData, jobsData);
      setJobMatches(matches);
      
      // Aggregate public data
      fetchPublicData(resumeData);
      
      // If LLM is configured, perform analysis
      if (isLlmConfigured) {
        performLlmAnalysis(resumeData, matches);
      }
    }
  }, [resumeData, isLlmConfigured]);
  
  // Generate dossier when we have resume data, job matches and public data
  useEffect(() => {
    if (resumeData && jobMatches.length > 0 && publicData) {
      generateDossierData(resumeData, jobMatches, publicData);
    }
  }, [resumeData, jobMatches, publicData]);

  const fetchPublicData = async (data: ParsedResume) => {
    if (!data || isAggregatingData) return;
    
    try {
      setIsAggregatingData(true);
      const result = await aggregatePublicData(data);
      setPublicData(result);
      
      if (Object.keys(result).length > 0) {
        toast({
          title: "Public Data Aggregated",
          description: "External data sources have been integrated into the analysis.",
        });
      }
    } catch (error) {
      console.error("Error aggregating public data:", error);
    } finally {
      setIsAggregatingData(false);
    }
  };

  const generateDossierData = async (data: ParsedResume, matches: JobMatch[], publicData: any) => {
    if (!data || matches.length === 0 || isGeneratingDossier) return;
    
    try {
      setIsGeneratingDossier(true);
      
      const result = await generateCandidateDossier(data, matches, publicData);
      
      if (result) {
        setDossier(result);
        toast({
          title: "Candidate Dossier Generated",
          description: "Comprehensive candidate profile is ready for review.",
        });
      }
    } catch (error) {
      console.error("Error generating candidate dossier:", error);
      toast({
        title: "Dossier Generation Error",
        description: "Could not create the candidate dossier.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDossier(false);
    }
  };

  const performLlmAnalysis = async (data: ParsedResume, matches: JobMatch[]) => {
    if (!data || matches.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const analysisResult = await llmService.analyzeJobFitment(data, matches);
      setLlmAnalysisData(analysisResult);
    } catch (error) {
      console.error("Error in LLM analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Could not complete AI analysis. Using standard analysis.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    jobMatches,
    isAnalyzing,
    publicData,
    isAggregatingData,
    dossier,
    isGeneratingDossier,
    llmAnalysisData
  };
};
