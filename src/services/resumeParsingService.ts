
// Export all resume service functionality from this index file
export type { ParsedResume } from './resume/types';
export { parseResume } from './resume/parseResume';
export { saveResumeData, getResumeData } from './resume/storageService';
