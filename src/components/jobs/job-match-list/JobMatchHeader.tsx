
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import JobMatchScoreBadge from './JobMatchScoreBadge';

interface JobMatchHeaderProps {
  title: string;
  company: string;
  fitPercentage: number;
}

const JobMatchHeader: React.FC<JobMatchHeaderProps> = ({ title, company, fitPercentage }) => {
  const getFitmentEmoji = (percentage: number) => {
    if (percentage >= 90) return "🔥";
    if (percentage >= 80) return "👍";
    if (percentage >= 70) return "👌";
    return "🤔";
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {title}
          <span className="text-sm ml-2">{getFitmentEmoji(fitPercentage)}</span>
        </CardTitle>
        <CardDescription className="text-sm">{company}</CardDescription>
      </div>
      <JobMatchScoreBadge score={fitPercentage} />
    </div>
  );
};

export default JobMatchHeader;
