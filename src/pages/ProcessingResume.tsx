
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

const ProcessingResume = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const processingSteps = [
    { name: "Analyzing Resume", duration: 5000 },
    { name: "Extracting Information", duration: 10000 },
    { name: "Preparing Results", duration: 3000 }
  ];
  
  // Calculate total duration
  const totalDuration = processingSteps.reduce((total, step) => total + step.duration, 0);

  useEffect(() => {
    // Get resume file data from session storage
    const resumeFileJson = sessionStorage.getItem('resumeFile');
    
    if (!resumeFileJson) {
      toast({
        title: "No resume found",
        description: "Please upload your resume first.",
        variant: "destructive"
      });
      navigate('/upload');
      return;
    }

    const resumeFile = JSON.parse(resumeFileJson);
    
    // Start the processing animation
    let startTime = Date.now();
    let stepStartTime = startTime;
    let currentStepIndex = 0;
    setCurrentStep(currentStepIndex);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const stepElapsed = Date.now() - stepStartTime;
      
      // Calculate overall progress percentage
      const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(newProgress);
      
      // Check if we need to move to the next step
      if (stepElapsed >= processingSteps[currentStepIndex].duration) {
        if (currentStepIndex < processingSteps.length - 1) {
          // Move to next step
          stepStartTime = Date.now();
          currentStepIndex++;
          setCurrentStep(currentStepIndex);
        }
      }
    }, 100);

    // Call the parse-resume edge function
    const parseResume = async () => {
      try {
        // Prepare the request to our edge function
        const response = await fetch('https://gjkdsndovpykswadsmcz.supabase.co/functions/v1/parse-resume', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fileUrl: resumeFile.url,
            fileName: resumeFile.name,
            fileType: resumeFile.type
          })
        });

        if (!response.ok) {
          throw new Error('Failed to parse resume');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Unknown error parsing resume');
        }
        
        // Store the parsed resume data in session storage
        sessionStorage.setItem('parsedResumeData', JSON.stringify(data.parsedResume));
        
        // Wait for the UI to complete its animation before redirecting
        setTimeout(() => {
          clearInterval(interval);
          navigate('/resume-summary');
        }, Math.max(0, totalDuration - (Date.now() - startTime)));
      } catch (error) {
        console.error('Error parsing resume:', error);
        toast({
          title: "Processing error",
          description: "There was an error processing your resume. Please try again.",
          variant: "destructive"
        });
        clearInterval(interval);
        navigate('/upload');
      }
    };

    // Start parsing after a short delay to allow the UI to initialize
    const parsingTimeout = setTimeout(parseResume, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      clearTimeout(parsingTimeout);
    };
  }, [navigate, totalDuration]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-talentsleuth">Processing Your Resume</h1>
            <p className="text-gray-600">
              This may take up to 30 seconds. Please don't close this page.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="rounded-full bg-talentsleuth/10 p-4">
                <Loader className="h-12 w-12 text-talentsleuth animate-spin" />
              </div>
            </div>
            
            <div className="space-y-6">
              {processingSteps.map((step, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{step.name}</span>
                    <span className={`text-sm font-medium ${
                      index < currentStep ? 'text-green-500' : 
                      index === currentStep ? 'text-talentsleuth' : 
                      'text-gray-400'
                    }`}>
                      {index < currentStep ? 'Complete' : 
                       index === currentStep ? 'In progress' : 
                       'Pending'}
                    </span>
                  </div>
                  <Progress 
                    value={
                      index < currentStep ? 100 : 
                      index === currentStep ? 
                        ((progress - (processingSteps.slice(0, index).reduce((total, s) => total + s.duration, 0) / totalDuration) * 100) / 
                        (step.duration / totalDuration) * 100) : 
                      0
                    } 
                    className={`h-2 ${
                      index < currentStep ? 'bg-green-100' : 
                      index === currentStep ? 'bg-talentsleuth/10' : 
                      'bg-gray-100'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>TalentSleuth AI is analyzing your resume and extracting relevant information.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProcessingResume;
