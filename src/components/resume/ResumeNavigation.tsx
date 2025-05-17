
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumeNavigationProps {
  onBack: () => void;
  onContinue: () => void;
}

const ResumeNavigation: React.FC<ResumeNavigationProps> = ({ onBack, onContinue }) => {
  return (
    <div className="flex justify-between">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button 
        className="bg-talentsleuth hover:bg-talentsleuth-light flex items-center gap-2"
        onClick={onContinue}
      >
        Continue to Job Matches
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ResumeNavigation;
