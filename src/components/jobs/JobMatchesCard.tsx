
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import JobMatchList from './job-match-list';
import { JobMatch } from '@/services/jobs/jobMatching';

interface JobMatchesCardProps {
  matches: JobMatch[];
}

const JobMatchesCard: React.FC<JobMatchesCardProps> = ({ matches }) => {
  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-talentsleuth" />
          Matching Roles
        </CardTitle>
        <CardDescription>
          Roles that best match your skills and experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <JobMatchList matches={matches.slice(0, 5)} />
      </CardContent>
    </Card>
  );
};

export default JobMatchesCard;
