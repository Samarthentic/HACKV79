
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Briefcase, CheckCircle, FileText, Github, Linkedin, ListChecks, Search, Star, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - in a real app this would come from backend/context
  const candidateData = {
    name: "John Doe",
    resumeUploadDate: "May 14, 2025",
    resumeSummary: "Senior Frontend Developer with 5 years of experience in React, TypeScript and modern web technologies.",
    fitmentScore: 82,
    fitmentReason: "missing 1 required skill (GraphQL)",
    redFlags: [
      { id: 1, message: "No LinkedIn profile found", severity: "high" },
      { id: 2, message: "Missing phone number", severity: "medium" },
    ],
    profiles: {
      linkedin: {
        name: "John Doe",
        title: "Senior Frontend Developer at TechCorp",
        skills: ["JavaScript", "React", "TypeScript", "CSS"],
        recentActivity: "Posted about React 18 features last week"
      },
      github: {
        name: "johndoe92",
        title: "30 repositories, 250 contributions this year",
        skills: ["JavaScript", "TypeScript", "React", "Node.js"],
        recentActivity: "Merged PR to personal project 2 days ago"
      },
      naukri: {
        name: "John Doe",
        title: "Looking for Senior Developer roles",
        skills: ["JavaScript", "React", "Redux", "HTML5/CSS3"],
        recentActivity: "Updated profile 1 month ago"
      }
    },
    skills: ["JavaScript", "React", "TypeScript", "HTML5", "CSS3", "Redux", "Node.js", "Git", "Jest", "Webpack"],
    suggestedRoles: [
      "Senior Frontend Developer", 
      "React Team Lead", 
      "Full Stack JavaScript Developer"
    ],
    nextSteps: [
      "Complete profile by adding LinkedIn account",
      "Update skills to include GraphQL experience",
      "Upload portfolio projects"
    ]
  };

  // Mock backend functions
  const handleParseResume = () => {
    toast({
      title: "Resume Parsed Successfully",
      description: "7 skills and 3 work experiences extracted",
      variant: "default",
    });
  };

  const handleSearchProfiles = () => {
    toast({
      title: "Profiles Located",
      description: "Found matching profiles on LinkedIn and GitHub",
      variant: "default",
    });
  };

  const handleCalculateScore = () => {
    toast({
      title: "Score Calculated",
      description: "82% match for current job requirements",
      variant: "default",
    });
  };

  // Helper function to get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  // Helper function to get color based on score
  const getFitmentColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {candidateData.name}</h1>
          <p className="text-gray-600">Here's your talent dashboard with insights and suggestions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Overview Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-talentsleuth" />
                  Last Resume
                </CardTitle>
                <CardDescription>Uploaded on {candidateData.resumeUploadDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{candidateData.resumeSummary}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/resume-summary')}>
                  View Full Resume
                </Button>
              </CardFooter>
            </Card>
            
            {/* Job Fitment Score Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Job Fitment Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{candidateData.fitmentScore}%</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getFitmentColor(candidateData.fitmentScore)}`}>
                    {candidateData.fitmentScore >= 80 ? "Good Match" : 
                     candidateData.fitmentScore >= 60 ? "Moderate Match" : 
                     "Low Match"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {candidateData.fitmentReason}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/job-fitment')}>
                  View Job Match Details
                </Button>
              </CardFooter>
            </Card>
            
            {/* Red Flags Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Red Flags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidateData.redFlags.map((flag) => (
                  <Alert key={flag.id} variant={flag.severity === "high" ? "destructive" : "default"} className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="ml-2">{flag.message}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            {/* Public Profiles */}
            <Card>
              <CardHeader>
                <CardTitle>LinkedIn Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
                  <div>
                    <h4 className="font-medium">{candidateData.profiles.linkedin.name}</h4>
                    <p className="text-sm text-gray-500">{candidateData.profiles.linkedin.title}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mt-2">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidateData.profiles.linkedin.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.linkedin.recentActivity}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Verify LinkedIn Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>GitHub Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Github className="mr-2 h-5 w-5" />
                  <div>
                    <h4 className="font-medium">{candidateData.profiles.github.name}</h4>
                    <p className="text-sm text-gray-500">{candidateData.profiles.github.title}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mt-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidateData.profiles.github.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-50">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.github.recentActivity}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Verify GitHub Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Naukri Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Search className="mr-2 h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{candidateData.profiles.naukri.name}</h4>
                    <p className="text-sm text-gray-500">{candidateData.profiles.naukri.title}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mt-2">Skills</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidateData.profiles.naukri.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.naukri.recentActivity}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Verify Naukri Data
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  My Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidateData.skills.map((skill) => (
                    <Badge key={skill} className="bg-talentsleuth/10 text-talentsleuth hover:bg-talentsleuth/20 border-none">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Suggested Roles Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-talentsleuth" />
                  Suggested Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {candidateData.suggestedRoles.map((role, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5 text-talentsleuth" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {candidateData.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-talentsleuth text-white rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Mock Backend Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-talentsleuth" />
                  Backend Actions
                </CardTitle>
                <CardDescription>Testing backend integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleParseResume} variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Parse Resume
                </Button>
                <Button onClick={handleSearchProfiles} variant="outline" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Search Profiles
                </Button>
                <Button onClick={handleCalculateScore} variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Calculate Score
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
