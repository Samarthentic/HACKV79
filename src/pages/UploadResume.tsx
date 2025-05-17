
import React, { useState, useRef } from 'react';
import { Check, Upload, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { parseResume } from '@/services/resumeParsingService';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<FileStatus>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const fileExtensions = ['.pdf', '.docx'];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: `Please upload a PDF or DOCX file. Received: ${file.type}`,
        variant: "destructive"
      });
      return;
    }
    
    setFile(file);
    toast({
      title: "File selected",
      description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const simulateUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus('success');
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    try {
      // Start resume parsing process as soon as upload completes
      setTimeout(async () => {
        clearInterval(interval);
        setUploadProgress(100);
        setStatus('success');
        
        // Wait a moment for upload to complete animation
        setTimeout(() => {
          navigate('/processing', { state: { file } });
        }, 500);
      }, 2000);
    } catch (error) {
      clearInterval(interval);
      setStatus('error');
      toast({
        title: "Error uploading file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    if (status !== 'success') {
      simulateUpload();
    } else {
      // Go to processing page immediately if already uploaded
      navigate('/processing', { state: { file } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-2 text-talentsleuth">Upload Your Resume</h1>
          <p className="text-gray-600 mb-8">Our AI will analyze your resume and match you with the best job opportunities.</p>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragging ? 'border-talentsleuth bg-talentsleuth/5' : 'border-gray-300 hover:border-talentsleuth/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileInput}
                />
                
                <div className="flex flex-col items-center justify-center gap-4">
                  {!file ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-talentsleuth/10 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-talentsleuth" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Drag & drop your resume here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Supported formats: {fileExtensions.join(', ')}
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      {status === 'success' ? (
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                      ) : status === 'uploading' ? (
                        <div className="w-16 h-16 rounded-full bg-talentsleuth/10 flex items-center justify-center">
                          <Loader className="h-8 w-8 text-talentsleuth animate-spin" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-talentsleuth/10 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-talentsleuth" />
                        </div>
                      )}
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {status === 'uploading' && (
                        <div className="w-full mt-2">
                          <Progress value={uploadProgress} className="h-2 w-full" />
                          <p className="text-xs text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNext} 
                  className="bg-talentsleuth hover:bg-talentsleuth-light"
                  disabled={status === 'uploading'}
                >
                  {status === 'uploading' ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    'Next'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Why upload your resume?</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Our AI analyzes your skills and experience to find the best matches</li>
              <li>Get personalized job recommendations based on your qualifications</li>
              <li>Your data is encrypted and secure - we respect your privacy</li>
              <li>Easily update your profile with new information anytime</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UploadResume;
