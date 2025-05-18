
import llmBaseService from './llmBaseService';
import resumeEnhancementService from './resumeEnhancementService';
import jobAnalysisService, { LlmAnalysisData } from './jobAnalysisService';
import { ParsedResume } from '../resume/types';
import { JobMatch } from '../jobs/jobMatchingService';

/**
 * Main service for handling interactions with Language Learning Models (LLMs)
 * This facade provides a unified interface to all LLM services
 */
export class LLMService {
  private static instance: LLMService;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  /**
   * Set the API key for OpenAI
   */
  public setApiKey(key: string): void {
    llmBaseService.setApiKey(key);
  }

  /**
   * Check if API key is configured
   */
  public isConfigured(): boolean {
    return llmBaseService.isConfigured();
  }

  /**
   * Enhance resume extraction using LLM
   */
  public async enhanceResumeExtraction(resumeText: string, initialExtraction: Partial<ParsedResume>): Promise<Partial<ParsedResume>> {
    return resumeEnhancementService.enhanceResumeExtraction(resumeText, initialExtraction);
  }

  /**
   * Analyze job fitment with LLM
   */
  public async analyzeJobFitment(resume: ParsedResume, jobMatches: JobMatch[]): Promise<LlmAnalysisData> {
    return jobAnalysisService.analyzeJobFitment(resume, jobMatches);
  }
}

// Export singleton instance
export default LLMService.getInstance();

// Export the LlmAnalysisData type for use in other files
export type { LlmAnalysisData } from './jobAnalysisService';
