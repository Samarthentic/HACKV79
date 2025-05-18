
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface JobMatchSkillsListProps {
  title: string;
  skills: string[];
  type: 'matching' | 'missing';
  maxToShow?: number;
}

const JobMatchSkillsList: React.FC<JobMatchSkillsListProps> = ({ 
  title, 
  skills, 
  type,
  maxToShow 
}) => {
  const isMatching = type === 'matching';
  const badgeClassName = isMatching 
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-red-50 text-red-700 border-red-200";
  
  const visibleSkills = maxToShow ? skills.slice(0, maxToShow) : skills;
  const remainingCount = maxToShow && skills.length > maxToShow ? skills.length - maxToShow : 0;

  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-2">{title} ({skills.length})</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {visibleSkills.map((skill, i) => (
          <Badge key={i} variant="outline" className={badgeClassName}>
            {skill}
          </Badge>
        ))}
        
        {remainingCount > 0 && (
          <Badge variant="outline" className={badgeClassName}>
            +{remainingCount} more
          </Badge>
        )}
        
        {skills.length === 0 && (
          <span className="text-sm text-gray-500 italic">
            {isMatching ? "No matching skills found" : "No missing skills identified"}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobMatchSkillsList;
