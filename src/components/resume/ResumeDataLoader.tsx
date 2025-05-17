
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { getResumeData, ParsedResume } from '@/services/resumeParsingService';
import ResumeLoadingSkeleton from './ResumeLoadingSkeleton';
import NoResumeData from './NoResumeData';

interface ResumeDataLoaderProps {
  children: (resumeData: ParsedResume) => React.ReactNode;
}

const ResumeDataLoader: React.FC<ResumeDataLoaderProps> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ResumeDataLoader: Attempting to fetch resume data");
    // Fetch the resume data when the component mounts
    const fetchResumeData = async () => {
      try {
        const data = await getResumeData();
        console.log("Resume data fetched:", data);
        if (data) {
          setResumeData(data);
          toast({
            title: "Resume data loaded",
            description: "Your resume has been successfully processed.",
          });
        } else {
          console.error("No resume data found in storage");
          toast({
            title: "Resume data not found",
            description: "Please upload and process your resume first.",
            variant: "destructive",
          });
          navigate('/upload', { replace: true });
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast({
          title: "Error fetching resume data",
          description: "There was an error retrieving your resume data.",
          variant: "destructive",
        });
        navigate('/upload', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [navigate]);

  if (loading) {
    return <ResumeLoadingSkeleton />;
  }

  if (!resumeData) {
    return <NoResumeData />;
  }

  return <>{children(resumeData)}</>;
};

export default ResumeDataLoader;
