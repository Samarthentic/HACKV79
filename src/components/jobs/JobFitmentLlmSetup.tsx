
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ApiKeySetup from '@/components/llm/ApiKeySetup';

interface JobFitmentLlmSetupProps {
  onLlmConfigured: () => void;
}

const JobFitmentLlmSetup: React.FC<JobFitmentLlmSetupProps> = ({ onLlmConfigured }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/resume-summary');
  };

  return (
    <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6 text-talentsleuth">AI-Powered Job Fitment Analysis</h1>
      <p className="text-gray-600 mb-8">
        Configure AI integration to get enhanced job matching and personalized career insights.
      </p>
      
      <ApiKeySetup onConfigured={onLlmConfigured} />
      
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
  );
};

export default JobFitmentLlmSetup;
