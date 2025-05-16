
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        {/* Welcome Section with subtle background */}
        <div className="mb-8 bg-gradient-to-r from-talentsleuth/5 to-talentsleuth-light/10 p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-2 text-talentsleuth-dark">Welcome, {candidateData.name}</h1>
          <p className="text-gray-600">Here's your talent dashboard with insights and suggestions</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Resume Overview Card */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-talentsleuth-light w-full"></div>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 h-5 w-5 text-talentsleuth" />
                    Last Resume
                  </CardTitle>
                  <span className="text-xs text-gray-500">Uploaded on {candidateData.resumeUploadDate}</span>
                </div>
                <CardDescription>Your latest resume analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{candidateData.resumeSummary}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full border-talentsleuth text-talentsleuth hover:bg-talentsleuth/10" 
                  onClick={() => navigate('/resume-summary')}>
                  View Full Resume
                </Button>
              </CardFooter>
            </Card>
            
            {/* Job Fitment Score Card */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-talentsleuth w-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Job Fitment Score</CardTitle>
                <CardDescription>How well you match job requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-full border-4 border-talentsleuth flex items-center justify-center text-xl font-bold text-talentsleuth">
                      {candidateData.fitmentScore}%
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getFitmentColor(candidateData.fitmentScore)}`}>
                      {candidateData.fitmentScore >= 80 ? "Good Match" : 
                      candidateData.fitmentScore >= 60 ? "Moderate Match" : 
                      "Low Match"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">Reason:</span> {candidateData.fitmentReason}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full border-talentsleuth text-talentsleuth hover:bg-talentsleuth/10" 
                  onClick={() => navigate('/job-fitment')}>
                  View Job Match Details
                </Button>
              </CardFooter>
            </Card>
            
            {/* Red Flags Card */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-destructive w-full"></div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                  Red Flags
                </CardTitle>
                <CardDescription>Issues that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidateData.redFlags.map((flag) => (
                  <Alert key={flag.id} variant="default" className="bg-red-50 border-red-200 py-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="ml-2 text-sm">{flag.message}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-6">
            {/* Public Profiles */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-[#0A66C2] w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Linkedin className="mr-2 h-5 w-5 text-[#0A66C2]" />
                  LinkedIn Profile
                </CardTitle>
                <CardDescription>Professional network data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium">{candidateData.profiles.linkedin.name}</h4>
                  <p className="text-sm text-gray-600">{candidateData.profiles.linkedin.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidateData.profiles.linkedin.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.linkedin.recentActivity}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50">
                  Verify LinkedIn Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gray-800 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub Profile
                </CardTitle>
                <CardDescription>Code repository contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">{candidateData.profiles.github.name}</h4>
                  <p className="text-sm text-gray-600">{candidateData.profiles.github.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {candidateData.profiles.github.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.github.recentActivity}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full border-gray-800 text-gray-800 hover:bg-gray-100">
                  Verify GitHub Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-blue-600 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Search className="mr-2 h-5 w-5 text-blue-600" />
                  Naukri Profile
                </CardTitle>
                <CardDescription>Job portal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h4 className="font-medium">{candidateData.profiles.naukri.name}</h4>
                  <p className="text-sm text-gray-600">{candidateData.profiles.naukri.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidateData.profiles.naukri.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
                  <span className="font-medium">Recent Activity:</span> {candidateData.profiles.naukri.recentActivity}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  Verify Naukri Data
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Skills Card */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-yellow-500 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Star className="mr-2 h-5 w-5 text-yellow-500" />
                  My Skills
                </CardTitle>
                <CardDescription>Your expertise areas</CardDescription>
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
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-talentsleuth w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Briefcase className="mr-2 h-5 w-5 text-talentsleuth" />
                  Suggested Roles
                </CardTitle>
                <CardDescription>Career paths that match your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {candidateData.suggestedRoles.map((role, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-800">{role}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Next Steps Card */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-talentsleuth-accent w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ListChecks className="mr-2 h-5 w-5 text-talentsleuth-accent" />
                  Next Steps
                </CardTitle>
                <CardDescription>Recommended actions to improve your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {candidateData.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                      <div className="bg-talentsleuth text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Mock Backend Actions */}
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className="h-2 bg-talentsleuth-accent w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Zap className="mr-2 h-5 w-5 text-talentsleuth-accent" />
                  Backend Actions
                </CardTitle>
                <CardDescription>Testing backend integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleParseResume} 
                  className="w-full justify-start bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm">
                  <FileText className="mr-2 h-4 w-4 text-talentsleuth" />
                  Parse Resume
                </Button>
                <Button onClick={handleSearchProfiles} 
                  className="w-full justify-start bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm">
                  <Search className="mr-2 h-4 w-4 text-blue-600" />
                  Search Profiles
                </Button>
                <Button onClick={handleCalculateScore} 
                  className="w-full justify-start bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
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
