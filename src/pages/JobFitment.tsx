
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
  Briefcase, 
  Flag, 
  Star, 
  Info, 
  CircleCheck, 
  CircleX 
} from 'lucide-react';

// Mock data for job fitment - in a real app this would come from an API
const fitmentData = {
  overallScore: 87,
  matchingRoles: [
    { title: "Senior Frontend Developer", company: "Tech Innovations Inc.", fitPercentage: 93, location: "San Francisco, CA", salary: "$120K - $150K" },
    { title: "Lead React Developer", company: "Digital Solutions", fitPercentage: 89, location: "Remote", salary: "$110K - $140K" },
    { title: "Full Stack Engineer", company: "Growth Technologies", fitPercentage: 82, location: "New York, NY", salary: "$115K - $145K" },
    { title: "Frontend Architect", company: "Enterprise Systems", fitPercentage: 78, location: "Austin, TX", salary: "$130K - $160K" },
    { title: "UI/UX Developer", company: "Creative Tech", fitPercentage: 72, location: "Seattle, WA", salary: "$100K - $130K" },
  ],
  redFlags: [
    { severity: "high", issue: "Missing contact phone number", impact: "Recruiters may have difficulty reaching you" },
    { severity: "medium", issue: "Gap in employment history (Jan 2021 - May 2021)", impact: "Might require explanation in interviews" },
    { severity: "low", issue: "Some technical skills lack specific examples", impact: "Could strengthen by adding concrete project examples" }
  ],
  strengths: [
    "Strong frontend development experience with React and TypeScript",
    "Proven leadership in team environments",
    "Impressive project portfolio with quantifiable results"
  ],
  areasToImprove: [
    "Backend technology experience is limited",
    "No formal certifications in relevant technologies",
    "Limited experience with cloud infrastructure"
  ]
};

const JobFitment = () => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-500";
      case "low": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };
  
  const getFitmentEmoji = (percentage: number) => {
    if (percentage >= 90) return "🔥";
    if (percentage >= 80) return "👍";
    if (percentage >= 70) return "👌";
    return "🤔";
  };
  
  const toggleRoleExpansion = (index: number) => {
    if (expandedRole === index) {
      setExpandedRole(null);
    } else {
      setExpandedRole(index);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-6 text-talentsleuth">Job Fitment Analysis</h1>
        <p className="text-gray-600 mb-8">
          Based on your resume, our AI has analyzed your skills, experience, and qualifications to find your ideal job matches.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Overall Score */}
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
                  <div className={`text-6xl font-bold ${getScoreColor(fitmentData.overallScore)}`}>
                    {fitmentData.overallScore}
                  </div>
                  <div className="text-lg text-gray-500 absolute -right-4 top-1">/100</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Strengths */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CircleCheck className="h-5 w-5 text-green-500" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {fitmentData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CircleCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Matching Roles */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-talentsleuth" />
              Matching Roles
            </CardTitle>
            <CardDescription>
              Roles that best match your skills and experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fitmentData.matchingRoles.map((role, index) => (
                <Card 
                  key={index} 
                  className={`border-l-4 ${
                    role.fitPercentage >= 90 ? 'border-l-green-500' : 
                    role.fitPercentage >= 80 ? 'border-l-green-400' : 
                    role.fitPercentage >= 70 ? 'border-l-yellow-500' : 
                    'border-l-orange-500'
                  } transition-all hover:shadow-md cursor-pointer`}
                  onClick={() => toggleRoleExpansion(index)}
                >
                  <CardHeader className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          {role.title}
                          <span className="text-sm ml-2">{getFitmentEmoji(role.fitPercentage)}</span>
                        </CardTitle>
                        <CardDescription className="text-sm">{role.company}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(role.fitPercentage)}`}>
                          {role.fitPercentage}%
                        </div>
                        <div className="text-sm text-gray-500">match</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedRole === index && (
                    <CardContent className="pt-0 pb-4">
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p>{role.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Salary Range</p>
                          <p>{role.salary}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full bg-talentsleuth hover:bg-talentsleuth-light">
                          View Job Details
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Red Flags */}
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
                {fitmentData.redFlags.map((flag, index) => (
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
                          <Button variant="outline" size="sm">Fix</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit your resume to fix this issue</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Areas to Improve */}
        <Card className="mb-10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <CircleX className="h-5 w-5 text-orange-500" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {fitmentData.areasToImprove.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CircleX className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="flex justify-between">
          <Button variant="outline">Back to Resume</Button>
          <Button className="bg-talentsleuth hover:bg-talentsleuth-light">
            Find More Jobs
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobFitment;
