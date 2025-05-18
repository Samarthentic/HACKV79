
import { ParsedResume } from '@/services/resume/types';

export interface ResumePageProps {
  resumeData: ParsedResume;
  onResumeDataUpdate: (updatedData: ParsedResume) => void;
  onBack: () => void;
  onContinue: () => void;
  isLlmConfigured?: boolean;
  isEnhancing?: boolean;
  onEnableAI?: () => void;
  publicData?: {
    linkedin?: any;
    github?: any;
    discrepancies?: Array<{type: string, description: string}>;
  };
}
