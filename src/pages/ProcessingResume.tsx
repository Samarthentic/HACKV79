
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ProcessingResume = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const processingSteps = [
    { name: "Analyzing Resume", duration: 5000 },
    { name: "Scanning Public Profiles", duration: 10000 },
    { name: "Scoring Candidate", duration: 8000 }
  ];
  
  // Calculate total duration
  const totalDuration = processingSteps.reduce((total, step) => total + step.duration, 0);

  useEffect(() => {
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
        } else if (elapsed >= totalDuration) {
          // We've completed all steps, redirect to results
          clearInterval(interval);
          navigate('/resume-summary');
        }
      }
    }, 100);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [navigate, totalDuration]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
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
            
            <div className="space-y-8">
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

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>TalentSleuth AI is analyzing your resume and gathering relevant information.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProcessingResume;
