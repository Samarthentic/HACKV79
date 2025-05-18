
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Award } from 'lucide-react';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';
import { toast } from '@/hooks/use-toast';
import ApiKeySetup from '@/components/llm/ApiKeySetup';
import llmService from '@/services/llm/llmService';
import { aggregatePublicData } from '@/services/publicData/aggregationService';
import { generateCandidateDossier, CandidateDossier } from '@/services/dossier/candidateDossierService';

// Job components
import ScoreCard from '@/components/jobs/ScoreCard';
import StrengthsCard from '@/components/jobs/StrengthsCard';
import AreasToImproveCard from '@/components/jobs/AreasToImproveCard';
import RedFlagsTable from '@/components/jobs/RedFlagsTable';
import JobMatchesCard from '@/components/jobs/JobMatchesCard';
import CandidateDossierCard from '@/components/jobs/CandidateDossierCard';

// Services
import { ParsedResume } from '@/services/resumeParsingService';
import { jobsData } from '@/services/jobs/jobsData';
import { calculateJobMatches, JobMatch } from '@/services/jobs/jobMatchingService';
import { 
  getOverallScore, 
  getStrengths, 
  getAreasToImprove, 
  getRedFlags 
} from '@/services/jobs/jobAnalysisUtils';
import { exportJobFitmentToPDF } from '@/services/pdfExportService';

const JobFitment = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isLlmConfigured, setIsLlmConfigured] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [publicData, setPublicData] = useState<any | null>(null);
  const [isAggregatingData, setIsAggregatingData] = useState<boolean>(false);
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isGeneratingDossier, setIsGeneratingDossier] = useState<boolean>(false);
  const [llmAnalysisData, setLlmAnalysisData] = useState<{
    strengths: string[];
    areasToImprove: string[];
    redFlags: Array<{severity: string; issue: string; impact: string;}>;
  } | null>(null);
  
  const navigate = useNavigate();
  const fitmentContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if LLM service is configured
    setIsLlmConfigured(llmService.isConfigured());
  }, []);

  const handleBack = () => {
    navigate('/resume-summary');
  };

  const handleLlmConfigured = () => {
    setIsLlmConfigured(true);
    if (resumeData && jobMatches.length > 0) {
      performLlmAnalysis();
    }
  };

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

  const generateDossier = async (data: ParsedResume, matches: JobMatch[]) => {
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

  const performLlmAnalysis = async () => {
    if (!resumeData || jobMatches.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const analysisResult = await llmService.analyzeJobFitment(resumeData, jobMatches);
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

  const handleExportPDF = async () => {
    if (!fitmentContentRef.current) return;
    
    try {
      setIsExporting(true);
      await exportJobFitmentToPDF('fitment-content', `job-fitment-${Date.now()}.pdf`);
      toast({
        title: "PDF Export Successful",
        description: "Your job fitment analysis has been downloaded as a PDF.",
      });
    } catch (error) {
      toast({
        title: "PDF Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Generate and process job fitment data when resume data is available
  useEffect(() => {
    if (resumeData) {
      // Calculate job matches
      const matches = calculateJobMatches(resumeData, jobsData);
      setJobMatches(matches);
      
      // Aggregate public data
      fetchPublicData(resumeData);
      
      // If LLM is configured, perform analysis
      if (isLlmConfigured) {
        performLlmAnalysis();
      }
    }
  }, [resumeData, isLlmConfigured]);
  
  // Generate dossier when we have resume data, job matches and public data
  useEffect(() => {
    if (resumeData && jobMatches.length > 0 && publicData) {
      generateDossier(resumeData, jobMatches);
    }
  }, [resumeData, jobMatches, publicData]);

  // If LLM is not configured, show setup component
  if (!isLlmConfigured) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
          <h1 className="text-3xl font-bold mb-6 text-talentsleuth">AI-Powered Job Fitment Analysis</h1>
          <p className="text-gray-600 mb-8">
            Configure AI integration to get enhanced job matching and personalized career insights.
          </p>
          
          <ApiKeySetup onConfigured={handleLlmConfigured} />
          
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resume
            </Button>
            <Button
              className="bg-gray-300 hover:bg-gray-400"
              onClick={() => navigate('/resume-summary')}
            >
              Continue Without AI
            </Button>
          </div>
        </div>
        
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
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-talentsleuth">Candidate Assessment</h1>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                  >
                    <Award className="h-4 w-4 mr-1" /> Premium Analysis
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8">
                Our AI has analyzed the candidate's resume, aggregated public data, and evaluated job fitment to provide a comprehensive assessment.
              </p>

              {(isAnalyzing || isAggregatingData || isGeneratingDossier) && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isAnalyzing ? "Performing AI analysis..." : 
                     isAggregatingData ? "Aggregating public data..." : 
                     "Generating candidate dossier..."}
                  </p>
                </div>
              )}

              <div id="fitment-content" ref={fitmentContentRef}>
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
              
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Resume
                </Button>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Export as PDF"}
                  </Button>
                  <Button className="bg-talentsleuth hover:bg-talentsleuth-light">
                    Find More Jobs
                  </Button>
                </div>
              </div>
            </div>
            
            <Footer />
          </div>
        );
      }}
    </ResumeDataLoader>
  );
};

export default JobFitment;
