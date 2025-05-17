
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getScoreColor } from '@/services/jobs/jobAnalysisUtils';

interface ScoreCardProps {
  score: number;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          Overall Fitment Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-full py-8">
          <div className="relative">
            <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-lg text-gray-500 absolute -right-4 top-1">/100</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
