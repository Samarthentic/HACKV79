
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditDialog from './EditDialog';

interface PersonalInfoSectionProps {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  onUpdate: (updatedData: any) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  personalInfo, 
  onUpdate 
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        <EditDialog 
          title="Personal Information"
          content={personalInfo}
          onSave={(updated) => onUpdate(updated)}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-bold text-xl">{personalInfo.name}</h3>
          <div className="text-gray-600 grid gap-1">
            <p>{personalInfo.email}</p>
            <p>{personalInfo.phone}</p>
            <p>{personalInfo.location}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
