
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ResumeLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((_, index) => (
        <Card key={index} className="mb-6">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResumeLoadingSkeleton;
