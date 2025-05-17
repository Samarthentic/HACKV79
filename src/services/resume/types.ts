
// Import centralized type definitions
import { PersonalInfo, Education, Experience, Certification } from './extractors/types';

// Types for parsed resume data
export interface ParsedResume {
  personalInfo: PersonalInfo;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
}
