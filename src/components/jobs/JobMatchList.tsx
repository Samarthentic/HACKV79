
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { JobMatch } from '@/services/jobs/jobMatchingService';

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
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };
  
  const getFitmentEmoji = (percentage: number) => {
    if (percentage >= 90) return "🔥";
    if (percentage >= 80) return "👍";
    if (percentage >= 70) return "👌";
    return "🤔";
  };

  return (
    <div className="space-y-4">
      {matches.map((match, index) => (
        <Card 
          key={index} 
          className={`border-l-4 ${
            match.fitPercentage >= 90 ? 'border-l-green-500' : 
            match.fitPercentage >= 80 ? 'border-l-green-400' : 
            match.fitPercentage >= 70 ? 'border-l-yellow-500' : 
            'border-l-orange-500'
          } transition-all hover:shadow-md cursor-pointer`}
          onClick={() => toggleJobExpansion(index)}
        >
          <CardHeader className="py-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  {match.job.title}
                  <span className="text-sm ml-2">{getFitmentEmoji(match.fitPercentage)}</span>
                </CardTitle>
                <CardDescription className="text-sm">{match.job.company}</CardDescription>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getScoreColor(match.fitPercentage)}`}>
                  {match.fitPercentage}%
                </div>
                <div className="text-sm text-gray-500">match</div>
              </div>
            </div>
          </CardHeader>
          
          {expandedJob === index && (
            <CardContent className="pt-0 pb-4">
              <Separator className="my-2" />
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p>{match.job.location || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Salary Range</p>
                  <p>{match.job.salaryRange || "Not specified"}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Matching Skills ({match.matchingSkills.length})</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.matchingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))}
                  {match.matchingSkills.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No matching skills found</span>
                  )}
                </div>
                
                <p className="text-sm font-medium text-gray-500 mb-2">Missing Skills ({match.missingSkills.length})</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.missingSkills.slice(0, 8).map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {skill}
                    </Badge>
                  ))}
                  {match.missingSkills.length > 8 && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      +{match.missingSkills.length - 8} more
                    </Badge>
                  )}
                  {match.missingSkills.length === 0 && (
                    <span className="text-sm text-gray-500 italic">No missing skills identified</span>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <Button className="w-full bg-talentsleuth hover:bg-talentsleuth-light">
                  View Full Job Details
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
      
      {matches.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No matching jobs found. Try updating your skills in your resume.</p>
        </Card>
      )}
    </div>
  );
};

export default JobMatchList;
