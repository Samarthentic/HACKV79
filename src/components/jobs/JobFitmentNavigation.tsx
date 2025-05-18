
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobFitmentExport from './JobFitmentExport';

interface JobFitmentNavigationProps {
  onBack: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
}

const JobFitmentNavigation: React.FC<JobFitmentNavigationProps> = ({ onBack, contentRef }) => {
  return (
    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Resume
      </Button>
      <div className="flex gap-4">
        <JobFitmentExport contentRef={contentRef} />
        <Button className="bg-talentsleuth hover:bg-talentsleuth-light">
          Find More Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobFitmentNavigation;
