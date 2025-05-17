
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import ResumeDataLoader from '@/components/resume/ResumeDataLoader';
import JobMatchList from '@/components/jobs/JobMatchList';

import { 
  Briefcase, 
  Flag, 
  Star, 
  Info, 
  CircleCheck, 
  CircleX,
  ArrowLeft
} from 'lucide-react';

import { ParsedResume } from '@/services/resumeParsingService';
import { jobsData } from '@/services/jobs/jobsData';
import { calculateJobMatches, JobMatch } from '@/services/jobs/jobMatchingService';

const JobFitment = () => {
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/resume-summary');
  };
  
  // Generate and process job fitment data when resume data is available
  useEffect(() => {
    if (resumeData) {
      const matches = calculateJobMatches(resumeData, jobsData);
      setJobMatches(matches);
    }
  }, [resumeData]);
  
  // Calculate overall score based on top matches
  const getOverallScore = (): number => {
    if (jobMatches.length === 0) return 0;
    
    // Take average of top 5 matches, or all if less than 5
    const topMatches = jobMatches.slice(0, Math.min(5, jobMatches.length));
    const total = topMatches.reduce((sum, match) => sum + match.fitPercentage, 0);
    return Math.round(total / topMatches.length);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600";
      case "medium": return "text-orange-500";
      case "low": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };
  
  // Identify resume strengths based on matching skills
  const getStrengths = (): string[] => {
    if (!resumeData || jobMatches.length === 0) return [];
    
    const strengths: string[] = [];
    
    // Add skill-based strengths
    const topSkills = getTopMatchingSkills(3);
    if (topSkills.length > 0) {
      strengths.push(`Strong skills in ${topSkills.join(', ')}`);
    }
    
    // Education-based strengths
    if (resumeData.education.length > 0) {
      const highestDegree = resumeData.education[0];
      strengths.push(`Educational background in ${highestDegree.degree} from ${highestDegree.institution}`);
    }
    
    // Experience-based strengths
    if (resumeData.experience.length > 0) {
      strengths.push(`Professional experience at ${resumeData.experience.map(e => e.company).join(', ')}`);
    }
    
    // If we don't have enough strengths, add some generic ones
    if (strengths.length < 3) {
      if (resumeData.skills.length > 5) {
        strengths.push('Diverse skill set applicable to multiple roles');
      }
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        strengths.push('Professional certifications that validate expertise');
      }
    }
    
    return strengths;
  };
  
  // Get top matching skills across all job matches
  const getTopMatchingSkills = (count: number): string[] => {
    if (jobMatches.length === 0) return [];
    
    // Count occurrences of each matching skill
    const skillCounts: Record<string, number> = {};
    jobMatches.forEach(match => {
      match.matchingSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    // Sort skills by occurrence count
    return Object.keys(skillCounts)
      .sort((a, b) => skillCounts[b] - skillCounts[a])
      .slice(0, count);
  };
  
  // Identify areas to improve based on missing skills
  const getAreasToImprove = (): string[] => {
    if (jobMatches.length === 0) return [];
    
    const areasToImprove: string[] = [];
    
    // Find common missing skills in top job matches
    const topMissingSkills = getTopMissingSkills(3);
    if (topMissingSkills.length > 0) {
      areasToImprove.push(`Consider developing skills in ${topMissingSkills.join(', ')}`);
    }
    
    // Education improvement suggestions
    const requiresHigherDegree = jobMatches.some(match => 
      match.job.description.includes("Master's") || 
      match.job.description.includes("Ph.D")
    );
    
    const hasHigherDegree = resumeData?.education.some(edu => 
      edu.degree.includes("Master") || 
      edu.degree.includes("Ph.D") ||
      edu.degree.includes("M.S.") ||
      edu.degree.includes("M.A.")
    );
    
    if (requiresHigherDegree && !hasHigherDegree) {
      areasToImprove.push('Consider pursuing advanced degrees for higher-level positions');
    }
    
    // Add more improvement areas if needed
    if (areasToImprove.length < 3) {
      areasToImprove.push('Expand your professional network to increase job opportunities');
      if (resumeData?.certifications && resumeData.certifications.length === 0) {
        areasToImprove.push('Obtain industry-relevant certifications to validate your skills');
      }
    }
    
    return areasToImprove;
  };
  
  // Get top missing skills across all job matches
  const getTopMissingSkills = (count: number): string[] => {
    if (jobMatches.length === 0) return [];
    
    // Count occurrences of each missing skill in top matches
    const skillCounts: Record<string, number> = {};
    jobMatches.slice(0, 5).forEach(match => {
      match.missingSkills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    // Sort skills by occurrence count
    return Object.keys(skillCounts)
      .sort((a, b) => skillCounts[b] - skillCounts[a])
      .slice(0, count);
  };
  
  // Identify resume red flags
  const getRedFlags = (): Array<{severity: string, issue: string, impact: string}> => {
    if (!resumeData) return [];
    
    const redFlags = [];
    
    // Check for missing contact information
    if (!resumeData.personalInfo.email) {
      redFlags.push({
        severity: "high",
        issue: "Missing email address",
        impact: "Recruiters won't be able to contact you"
      });
    }
    
    if (!resumeData.personalInfo.phone) {
      redFlags.push({
        severity: "medium",
        issue: "Missing phone number",
        impact: "Limited contact options for employers"
      });
    }
    
    // Check for missing key sections
    if (resumeData.skills.length === 0) {
      redFlags.push({
        severity: "high",
        issue: "No skills listed in resume",
        impact: "Difficult for employers to assess your capabilities"
      });
    }
    
    if (resumeData.education.length === 0) {
      redFlags.push({
        severity: "medium",
        issue: "No education history in resume",
        impact: "Many positions require specific educational background"
      });
    }
    
    if (resumeData.experience.length === 0) {
      redFlags.push({
        severity: "high",
        issue: "No work experience listed",
        impact: "Employers value demonstrated practical experience"
      });
    }
    
    // Check for skill gaps compared to job market
    const missingInDemandSkills = getTopMissingSkills(3);
    if (missingInDemandSkills.length > 0) {
      redFlags.push({
        severity: "medium",
        issue: `Missing in-demand skills: ${missingInDemandSkills.join(', ')}`,
        impact: "These skills appear frequently in job listings"
      });
    }
    
    return redFlags;
  };

  return (
    <ResumeDataLoader>
      {(loadedData) => {
        // Set the resume data when first loaded
        if (!resumeData) {
          setResumeData(loadedData);
        }
        
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
                        <div className={`text-6xl font-bold ${getScoreColor(getOverallScore())}`}>
                          {getOverallScore()}
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
                      {getStrengths().map((strength, index) => (
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
                  <JobMatchList matches={jobMatches.slice(0, 5)} />
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
                      {getRedFlags().map((flag, index) => (
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
                      {getRedFlags().length === 0 && (
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
                    {getAreasToImprove().map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CircleX className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Resume
                </Button>
                <Button className="bg-talentsleuth hover:bg-talentsleuth-light">
                  Find More Jobs
                </Button>
              </div>
            </div>
            
            <Footer />
          </div>
        );
      }}
    </ResumeDataLoader>
  );
};

export default JobFitment;
