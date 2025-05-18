
import React from 'react';

interface JobMatchScoreBadgeProps {
  score: number;
}

const JobMatchScoreBadge: React.FC<JobMatchScoreBadgeProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="text-right">
      <div className={`text-lg font-bold ${getScoreColor(score)}`}>
        {score}%
      </div>
      <div className="text-sm text-gray-500">match</div>
    </div>
  );
};

export default JobMatchScoreBadge;
