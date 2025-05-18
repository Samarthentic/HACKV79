
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardContent } from '@/components/ui/card';
import JobMatchSkillsList from './JobMatchSkillsList';

interface JobMatchDetailsProps {
  location: string;
  salaryRange: string;
  matchingSkills: string[];
  missingSkills: string[];
}

const JobMatchDetails: React.FC<JobMatchDetailsProps> = ({
  location,
  salaryRange,
  matchingSkills,
  missingSkills
}) => {
  return (
    <CardContent className="pt-0 pb-4">
      <Separator className="my-2" />
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{location || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Salary Range</p>
          <p>{salaryRange || "Not specified"}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <JobMatchSkillsList
          title="Matching Skills"
          skills={matchingSkills}
          type="matching"
        />
        
        <JobMatchSkillsList
          title="Missing Skills"
          skills={missingSkills}
          type="missing"
          maxToShow={8}
        />
      </div>
      
      <div className="mt-4">
        <Button className="w-full bg-talentsleuth hover:bg-talentsleuth-light">
          View Full Job Details
        </Button>
      </div>
    </CardContent>
  );
};

export default JobMatchDetails;
