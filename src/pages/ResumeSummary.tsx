
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { getResumeData, saveResumeData, ParsedResume } from '@/services/resumeParsingService';

import PersonalInfoSection from '@/components/resume/PersonalInfoSection';
import SkillsSection from '@/components/resume/SkillsSection';
import EducationSection from '@/components/resume/EducationSection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import CertificationsSection from '@/components/resume/CertificationsSection';
import ResumeLoadingSkeleton from '@/components/resume/ResumeLoadingSkeleton';
import NoResumeData from '@/components/resume/NoResumeData';
import ResumeNavigation from '@/components/resume/ResumeNavigation';

type EditableSection = 'personalInfo' | 'skills' | 'education' | 'experience' | 'certifications';

const ResumeSummary = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ResumeSummary: Attempting to fetch resume data");
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

  const handleSectionUpdate = async (section: EditableSection, updatedData: any) => {
    if (!resumeData) return;

    const updatedResumeData = {
      ...resumeData,
      [section]: updatedData
    };
    
    setResumeData(updatedResumeData);
    
    try {
      // Save the updated resume data
      await saveResumeData(updatedResumeData);
    } catch (error) {
      console.error("Error saving updated resume data:", error);
      toast({
        title: "Error saving changes",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/upload');
  };

  const handleContinue = () => {
    navigate('/job-fitment');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
          <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
          <ResumeLoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <NoResumeData />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Resume Summary</h1>
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        <PersonalInfoSection 
          personalInfo={resumeData.personalInfo}
          onUpdate={(updated) => handleSectionUpdate('personalInfo', updated)}
        />

        <SkillsSection 
          skills={resumeData.skills}
          onUpdate={(updated) => handleSectionUpdate('skills', updated)}
        />

        <EducationSection 
          education={resumeData.education}
          onUpdate={(updated) => handleSectionUpdate('education', updated)}
        />

        <ExperienceSection 
          experience={resumeData.experience}
          onUpdate={(updated) => handleSectionUpdate('experience', updated)}
        />

        <CertificationsSection 
          certifications={resumeData.certifications}
          onUpdate={(updated) => handleSectionUpdate('certifications', updated)}
        />

        <ResumeNavigation onBack={handleBack} onContinue={handleContinue} />
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumeSummary;
