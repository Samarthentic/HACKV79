
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Flag, Info } from 'lucide-react';
import { getSeverityColor } from '@/services/jobs/jobAnalysisUtils';

interface RedFlag {
  severity: string;
  issue: string;
  impact: string;
}

interface RedFlagsTableProps {
  redFlags: RedFlag[];
}

const RedFlagsTable: React.FC<RedFlagsTableProps> = ({ redFlags }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          Resume Red Flags
        </CardTitle>
        <CardDescription>
          Issues that might affect your job applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Potential Impact</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {redFlags.map((flag, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      flag.severity === 'high' ? 'bg-red-500' : 
                      flag.severity === 'medium' ? 'bg-orange-400' : 
                      'bg-yellow-400'
                    }`}></div>
                    <span className={`capitalize ${getSeverityColor(flag.severity)}`}>
                      {flag.severity}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{flag.issue}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        {flag.impact.substring(0, 30)}
                        {flag.impact.length > 30 && '...'}
                        <Info className="h-3 w-3 text-gray-400" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <p className="text-sm">{flag.impact}</p>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate('/resume-summary')}
                      >Fix</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit your resume to fix this issue</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {redFlags.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <p className="text-green-600">No red flags detected in your resume!</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RedFlagsTable;
