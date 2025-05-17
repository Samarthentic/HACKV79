
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleX } from 'lucide-react';

interface AreasToImproveCardProps {
  areas: string[];
}

const AreasToImproveCard: React.FC<AreasToImproveCardProps> = ({ areas }) => {
  return (
    <Card className="mb-10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CircleX className="h-5 w-5 text-orange-500" />
          Areas to Improve
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {areas.map((area, index) => (
            <li key={index} className="flex items-start gap-2">
              <CircleX className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AreasToImproveCard;
