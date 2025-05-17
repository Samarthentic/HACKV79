
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditDialog from './EditDialog';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface EducationSectionProps {
  education: Education[];
  onUpdate: (updatedData: any) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  education, 
  onUpdate 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        <EditDialog 
          title="Education"
          content={education}
          onSave={(updated) => onUpdate(updated)}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-gray-500 text-sm">{edu.year}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EducationSection;
