
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditDialog from './EditDialog';

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface CertificationsSectionProps {
  certifications: Certification[];
  onUpdate: (updatedData: any) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({ 
  certifications, 
  onUpdate 
}) => {
  return (
    <Card className="mb-10">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Certifications</CardTitle>
        <EditDialog 
          title="Certifications"
          content={certifications}
          onSave={(updated) => onUpdate(updated)}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-gray-600">{cert.issuer}</p>
              <p className="text-gray-500 text-sm">{cert.year}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationsSection;
