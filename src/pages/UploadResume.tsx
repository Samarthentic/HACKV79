
import React from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeDropzone from '@/components/resume/ResumeDropzone';
import WhyUploadResume from '@/components/resume/WhyUploadResume';
import { useResumeUpload } from '@/hooks/useResumeUpload';

const UploadResume = () => {
  const { file, status, uploadProgress, handleFileSelect, handleUpload } = useResumeUpload();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 section-padding flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-2 text-talentsleuth">Upload Your Resume</h1>
          <p className="text-gray-600 mb-8">Our AI will analyze your resume and match you with the best job opportunities.</p>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <ResumeDropzone 
                onFileSelect={handleFileSelect}
                status={status}
                uploadProgress={uploadProgress}
                file={file}
              />

              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleUpload} 
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

          <WhyUploadResume />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UploadResume;
