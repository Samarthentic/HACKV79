
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';

interface StrengthsCardProps {
  strengths: string[];
}

const StrengthsCard: React.FC<StrengthsCardProps> = ({ strengths }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CircleCheck className="h-5 w-5 text-green-500" />
          Your Strengths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <CircleCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default StrengthsCard;
