
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

export const useResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<FileStatus>('idle');
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
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

  const handleUpload = () => {
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

  return {
    file,
    status,
    uploadProgress,
    handleFileSelect,
    handleUpload
  };
};
