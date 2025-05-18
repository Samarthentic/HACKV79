
import React from 'react';
import EmptyMatchesCard from './EmptyMatchesCard';
import JobMatchCard from './JobMatchCard';
import { JobMatch } from '@/services/jobs/jobMatching';

interface JobMatchListProps {
  matches: JobMatch[];
}

const JobMatchList: React.FC<JobMatchListProps> = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return <EmptyMatchesCard />;
  }

  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <JobMatchCard key={index} match={match} />
      ))}
    </div>
  );
};

export default JobMatchList;
