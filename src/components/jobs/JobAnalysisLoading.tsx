
import React from 'react';

interface JobAnalysisLoadingProps {
  isAnalyzing: boolean;
  isAggregatingData: boolean;
  isGeneratingDossier: boolean;
}

const JobAnalysisLoading: React.FC<JobAnalysisLoadingProps> = ({ 
  isAnalyzing, 
  isAggregatingData, 
  isGeneratingDossier 
}) => {
  if (!isAnalyzing && !isAggregatingData && !isGeneratingDossier) {
    return null;
  }

  return (
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
  );
};

export default JobAnalysisLoading;
