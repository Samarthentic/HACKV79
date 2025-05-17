
// Export all resume service functionality from this index file
export type { ParsedResume } from './resume/types';
export { parseResume } from './resume/parseResume';
export { saveResumeData, getResumeData } from './resume/storageService';
export { 
  extractTextFromFile,
  extractName,
  extractEmail,
  extractPhone,
  extractLocation,
  extractSkills,
  extractEducation,
  extractExperience,
  extractCertifications
} from './resume/extractors';
