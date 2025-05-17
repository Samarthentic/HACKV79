
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';

// Job components
import ScoreCard from '@/components/jobs/ScoreCard';
import StrengthsCard from '@/components/jobs/StrengthsCard';
import AreasToImproveCard from '@/components/jobs/AreasToImproveCard';
import RedFlagsTable from '@/components/jobs/RedFlagsTable';
import JobMatchesCard from '@/components/jobs/JobMatchesCard';

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

const JobFitment = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/resume-summary');
  };
  
  // Generate and process job fitment data when resume data is available
  useEffect(() => {
    if (resumeData) {
      const matches = calculateJobMatches(resumeData, jobsData);
      setJobMatches(matches);
    }
  }, [resumeData]);

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
              <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Job Fitment Analysis</h1>
              <p className="text-gray-600 mb-8">
                Based on your resume, our AI has analyzed your skills, experience, and qualifications to find your ideal job matches.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {/* Overall Score */}
                <ScoreCard score={getOverallScore(jobMatches)} />
                
                {/* Strengths */}
                <StrengthsCard strengths={getStrengths(resumeData, jobMatches)} />
              </div>
              
              {/* Matching Roles */}
              <JobMatchesCard matches={jobMatches} />
              
              {/* Red Flags */}
              <RedFlagsTable redFlags={getRedFlags(resumeData)} />
              
              {/* Areas to Improve */}
              <AreasToImproveCard areas={getAreasToImprove(resumeData, jobMatches)} />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Resume
                </Button>
                <Button className="bg-talentsleuth hover:bg-talentsleuth-light">
                  Find More Jobs
                </Button>
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
