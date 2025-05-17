
/**
 * Centralized type definitions for resume extractors
 */

// Personal Information Types
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

// Education Types
export interface Education {
  degree: string;
  institution: string;
  year: string;
}

// Experience Types
export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

// Certification Types
export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

// File Extractor Types
export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'unknown';

export interface FileExtractionResult {
  text: string;
  success: boolean;
  error?: string;
}
