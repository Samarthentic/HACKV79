
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { JobMatch } from '@/services/jobs/jobMatching';
import JobMatchHeader from './JobMatchHeader';
import JobMatchDetails from './JobMatchDetails';

interface JobMatchCardProps {
  match: JobMatch;
  index: number;
  expandedJob: number | null;
  toggleJobExpansion: (index: number) => void;
}

const JobMatchCard: React.FC<JobMatchCardProps> = ({
  match,
  index,
  expandedJob,
  toggleJobExpansion
}) => {
  const getBorderColor = (percentage: number) => {
    if (percentage >= 90) return 'border-l-green-500';
    if (percentage >= 80) return 'border-l-green-400';
    if (percentage >= 70) return 'border-l-yellow-500';
    return 'border-l-orange-500';
  };

  return (
    <Card 
      className={`border-l-4 ${getBorderColor(match.fitPercentage)} transition-all hover:shadow-md cursor-pointer`}
      onClick={() => toggleJobExpansion(index)}
    >
      <CardHeader className="py-4">
        <JobMatchHeader
          title={match.job.title}
          company={match.job.company}
          fitPercentage={match.fitPercentage}
        />
      </CardHeader>
      
      {expandedJob === index && (
        <JobMatchDetails
          location={match.job.location}
          salaryRange={match.job.salaryRange}
          matchingSkills={match.matchingSkills}
          missingSkills={match.missingSkills}
        />
      )}
    </Card>
  );
};

export default JobMatchCard;
