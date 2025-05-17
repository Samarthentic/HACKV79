
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NoResumeData: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-1 section-padding container mx-auto max-w-4xl py-10 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-talentsleuth">No Resume Data Found</h1>
        <p className="text-gray-600 mb-6">
          Please upload and process your resume first to view the summary.
        </p>
        <Button 
          className="bg-talentsleuth hover:bg-talentsleuth-light"
          onClick={() => navigate('/upload')}
        >
          Upload Resume
        </Button>
      </div>
    </div>
  );
};

export default NoResumeData;
