
import React from 'react';
import { saveResumeData, ParsedResume } from '@/services/resumeParsingService';
import { toast } from '@/hooks/use-toast';

import PersonalInfoSection from './PersonalInfoSection';
import SkillsSection from './SkillsSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import CertificationsSection from './CertificationsSection';

type EditableSection = 'personalInfo' | 'skills' | 'education' | 'experience' | 'certifications';

interface ResumeContentProps {
  resumeData: ParsedResume;
  onResumeDataUpdate: (updatedData: ParsedResume) => void;
}

const ResumeContent: React.FC<ResumeContentProps> = ({ resumeData, onResumeDataUpdate }) => {
  const handleSectionUpdate = async (section: EditableSection, updatedData: any) => {
    const updatedResumeData = {
      ...resumeData,
      [section]: updatedData
    };
    
    onResumeDataUpdate(updatedResumeData);
    
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

  return (
    <>
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
    </>
  );
};

export default ResumeContent;
