
import React, { useState } from 'react';
import { JobMatch } from '@/services/jobs/jobMatching';
import JobMatchCard from './JobMatchCard';
import EmptyMatchesCard from './EmptyMatchesCard';

interface JobMatchListProps {
  matches: JobMatch[];
}

const JobMatchList: React.FC<JobMatchListProps> = ({ matches }) => {
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  
  const toggleJobExpansion = (index: number) => {
    if (expandedJob === index) {
      setExpandedJob(null);
    } else {
      setExpandedJob(index);
    }
  };
  
  if (matches.length === 0) {
    return <EmptyMatchesCard />;
  }

  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <JobMatchCard 
          key={index}
          match={match}
          index={index}
          expandedJob={expandedJob}
          toggleJobExpansion={toggleJobExpansion}
        />
      ))}
    </div>
  );
};

export default JobMatchList;
