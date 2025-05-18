
import { ParsedResume } from '../resume/types';
import llmBaseService from './llmBaseService';

/**
 * Service for enhancing resume extractions using LLM
 */
export class ResumeEnhancementService {
  private static instance: ResumeEnhancementService;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ResumeEnhancementService {
    if (!ResumeEnhancementService.instance) {
      ResumeEnhancementService.instance = new ResumeEnhancementService();
    }
    return ResumeEnhancementService.instance;
  }

  /**
   * Enhance resume extraction using LLM with improved prompt engineering
   */
  public async enhanceResumeExtraction(resumeText: string, initialExtraction: Partial<ParsedResume>): Promise<Partial<ParsedResume>> {
    try {
      const prompt = `
        You are an expert resume parser with deep knowledge of industry terminologies, job roles, and skills.
        
        TASK: Analyze and enhance the extracted information from a resume.
        
        RESUME TEXT:
        ${resumeText.substring(0, 6000)} ${resumeText.length > 6000 ? '...(truncated)' : ''}
        
        INITIAL EXTRACTION:
        ${JSON.stringify(initialExtraction, null, 2)}
        
        INSTRUCTIONS:
        1. Carefully analyze the full resume text
        2. Identify and correct any errors in the initial extraction
        3. Extract additional skills that might have been missed, especially implied skills
        4. Standardize and categorize skills (technical, soft, domain-specific)
        5. Ensure job titles and company names are correctly formatted
        6. Normalize education data (degree names, institutions)
        7. Add any certifications that were missed
        8. Improve the description of experiences to highlight achievements
        
        Return ONLY valid JSON format that matches the structure of the initial extraction, with no explanation.
      `;

      const response = await llmBaseService.makeRequest('/chat/completions', {
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a highly precise resume parsing assistant. Return only valid, well-structured JSON data.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Lower temperature for more deterministic results
        max_tokens: 4000
      });

      // Try to parse the response as JSON
      try {
        const content = response.choices[0].message.content;
        // Find JSON content if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const jsonContent = jsonMatch[1].trim();
        return JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('Error parsing LLM response as JSON:', parseError);
        return initialExtraction;
      }
    } catch (error) {
      console.error('Error enhancing resume with LLM:', error);
      return initialExtraction;
    }
  }
}

export default ResumeEnhancementService.getInstance();
