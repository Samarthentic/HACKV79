
import React, { useState, useRef } from 'react';
import { Check, Upload, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import FileInfoDisplay from './FileInfoDisplay';

type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface ResumeDropzoneProps {
  onFileSelect: (file: File) => void;
  status: FileStatus;
  uploadProgress: number;
  file: File | null;
}

const ResumeDropzone: React.FC<ResumeDropzoneProps> = ({ 
  onFileSelect, 
  status, 
  uploadProgress,
  file
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    onFileSelect(file);
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

  return (
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
            
            {/* Display file information */}
            {file && <FileInfoDisplay file={file} />}
            
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
  );
};

export default ResumeDropzone;
