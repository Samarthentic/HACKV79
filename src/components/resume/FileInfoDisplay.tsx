
import React from 'react';

interface FileInfoDisplayProps {
  file: File;
}

const FileInfoDisplay: React.FC<FileInfoDisplayProps> = ({ file }) => {
  return (
    <>
      <p className="font-medium">{file.name}</p>
      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
    </>
  );
};

export default FileInfoDisplay;
