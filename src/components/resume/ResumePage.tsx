
import React from 'react';
import { ParsedResume } from '@/services/resumeParsingService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeNavigation from './ResumeNavigation';
import ResumeContent from './ResumeContent';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, FileText, FileUser, Database, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResumePageProps {
  resumeData: ParsedResume;
  onResumeDataUpdate: (updatedData: ParsedResume) => void;
  onBack: () => void;
  onContinue: () => void;
  isLlmConfigured?: boolean;
  isEnhancing?: boolean;
  onEnableAI?: () => void;
  publicData?: {
    linkedin?: any;
    github?: any;
    discrepancies?: Array<{type: string, description: string}>;
  };
}

const ResumePage: React.FC<ResumePageProps> = ({
  resumeData,
  onResumeDataUpdate,
  onBack,
  onContinue,
  isLlmConfigured,
  isEnhancing,
  onEnableAI,
  publicData
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding container mx-auto max-w-4xl py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-talentsleuth">Resume Analysis</h1>
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <FileText className="w-4 h-4 mr-1" /> Resume Parsed
            </Badge>
            {publicData && Object.keys(publicData).length > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Database className="w-4 h-4 mr-1" /> Public Data Aggregated
              </Badge>
            )}
            {isLlmConfigured && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <FileUser className="w-4 h-4 mr-1" /> AI Enhanced
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Here's the information we've extracted from your resume. You can edit any section if needed.
        </p>

        {isLlmConfigured === false && onEnableAI && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-medium text-blue-800">Enable AI Enhancement</h3>
            <p className="text-blue-600 mb-3">
              Get more accurate resume analysis with our AI assistant.
            </p>
            <button 
              onClick={onEnableAI}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Enable AI Analysis
            </button>
          </div>
        )}
        
        {isEnhancing && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-700 mr-3"></div>
            <p className="text-amber-700">AI is enhancing your resume analysis...</p>
          </div>
        )}

        {publicData?.discrepancies && publicData.discrepancies.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-red-800">
                <Flag className="h-5 w-5 mr-2 text-red-600" /> Discrepancies Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {publicData.discrepancies.map((discrepancy, idx) => (
                  <li key={idx} className="text-red-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{discrepancy.description}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {publicData?.linkedin && (
          <Card className="mb-6 border-blue-200">
            <CardHeader className="pb-2 bg-blue-50">
              <CardTitle className="text-blue-800 text-lg flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600">
                <p><strong>Profile URL:</strong> {publicData.linkedin.profileUrl || 'Not found'}</p>
                <p><strong>Connections:</strong> {publicData.linkedin.connections || 'Not found'}</p>
                {publicData.linkedin.additionalExperience && (
                  <div className="mt-2">
                    <p className="font-medium text-blue-700">Additional Experience Found:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      {publicData.linkedin.additionalExperience.map((exp: any, idx: number) => (
                        <li key={idx}>{exp.role} at {exp.company} ({exp.period})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-50"
                onClick={() => window.open(publicData.linkedin.profileUrl, '_blank')}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {publicData?.github && (
          <Card className="mb-6 border-gray-200">
            <CardHeader className="pb-2 bg-gray-50">
              <CardTitle className="text-gray-800 text-lg flex items-center">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600">
                <p><strong>Username:</strong> {publicData.github.username || 'Not found'}</p>
                <p><strong>Repositories:</strong> {publicData.github.repoCount || 'Not found'}</p>
                <p><strong>Contributions:</strong> {publicData.github.contributions || 'Not found'}</p>
                
                {publicData.github.topLanguages && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700">Top Languages:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {publicData.github.topLanguages.map((lang: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-100">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 text-gray-600 border-gray-300 hover:bg-gray-50"
                onClick={() => window.open(`https://github.com/${publicData.github.username}`, '_blank')}
              >
                View GitHub
              </Button>
            </CardContent>
          </Card>
        )}

        <ResumeContent 
          resumeData={resumeData} 
          onResumeDataUpdate={onResumeDataUpdate} 
        />

        <ResumeNavigation onBack={onBack} onContinue={onContinue} />
      </div>
      
      <Footer />
    </div>
  );
};

export default ResumePage;
