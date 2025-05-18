
import React from 'react';
import { Card } from '@/components/ui/card';

const EmptyMatchesCard: React.FC = () => {
  return (
    <Card className="p-6 text-center">
      <p className="text-gray-500">
        No matching jobs found. Try updating your skills in your resume.
      </p>
    </Card>
  );
};

export default EmptyMatchesCard;
