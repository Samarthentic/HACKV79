
import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobFitmentHeader: React.FC = () => {
  return (
    <>
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
    </>
  );
};

export default JobFitmentHeader;
