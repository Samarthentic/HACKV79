
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditDialog from './EditDialog';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface ExperienceSectionProps {
  experience: Experience[];
  onUpdate: (updatedData: any) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  experience, 
  onUpdate 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        <EditDialog 
          title="Experience"
          content={experience}
          onSave={(updated) => onUpdate(updated)}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className={index > 0 ? "pt-6 border-t" : ""}>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{exp.title}</h3>
                <span className="text-gray-500 text-sm">{exp.period}</span>
              </div>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
