
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditDialog from './EditDialog';

interface SkillsSectionProps {
  skills: string[];
  onUpdate: (updatedData: any) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  skills, 
  onUpdate 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Skills</CardTitle>
        <EditDialog 
          title="Skills"
          content={skills}
          onSave={(updated) => onUpdate(updated)}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index}
              className="bg-talentsleuth/10 text-talentsleuth px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
