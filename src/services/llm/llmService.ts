
import { toast } from '@/hooks/use-toast';
import { ParsedResume } from '../resume/types';
import { JobMatch } from '../jobs/jobMatchingService';

// Model configuration - using the most accurate model available
const MODEL = 'gpt-4o';
const MAX_TOKENS = 4000; // Increased token limit for more thorough analysis

/**
 * Service for handling interactions with Language Learning Models (LLMs)
 */
export class LLMService {
  private static instance: LLMService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';

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
    this.apiKey = key;
  }

  /**
   * Check if API key is configured
   */
  public isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Handle API request with proper error handling
   */
  private async makeRequest(endpoint: string, body: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LLM API Error:', error);
      throw error;
    }
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

      const response = await this.makeRequest('/chat/completions', {
        model: MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are a highly precise resume parsing assistant. Return only valid, well-structured JSON data.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Lower temperature for more deterministic results
        max_tokens: MAX_TOKENS
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

  /**
   * Analyze job fitment with LLM using enhanced analysis techniques
   */
  public async analyzeJobFitment(resume: ParsedResume, jobMatches: JobMatch[]): Promise<{
    strengths: string[];
    areasToImprove: string[];
    redFlags: Array<{severity: string; issue: string; impact: string;}>;
  }> {
    try {
      const prompt = `
        You are an expert career advisor and talent acquisition specialist with deep knowledge of industry requirements and job market trends.
        
        TASK: Provide a detailed analysis of a candidate's resume against specific job matches.
        
        CANDIDATE RESUME:
        ${JSON.stringify(resume, null, 2)}
        
        JOB MATCHES (Top 3):
        ${JSON.stringify(jobMatches.slice(0, 3), null, 2)}
        
        INSTRUCTIONS:
        1. Analyze the alignment between the resume and job matches with extreme precision
        2. Identify specific strengths that make the candidate competitive
        3. Pinpoint concrete areas where the candidate should improve to increase employability
        4. Highlight potential red flags in the resume that might concern employers
        5. Consider both technical fit and soft skills/cultural alignment
        6. Base your analysis on current industry standards and expectations
        7. Be specific, actionable, and thorough in your assessment
        
        FORMAT YOUR RESPONSE AS JSON with these keys:
        - strengths: Array of specific strengths (8-12 items)
        - areasToImprove: Array of specific improvement areas (5-8 items)
        - redFlags: Array of objects with {severity: "high"|"medium"|"low", issue: "description", impact: "explanation"}
        
        Return ONLY valid JSON with no explanatory text.
      `;

      const response = await this.makeRequest('/chat/completions', {
        model: MODEL,
        messages: [
          { 
            role: 'system', 
            content: 'You are a precision-focused career analysis assistant. Return only valid, detailed JSON data.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: MAX_TOKENS
      });

      try {
        const content = response.choices[0].message.content;
        // Find JSON content if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const jsonContent = jsonMatch[1].trim();
        return JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('Error parsing LLM job analysis response:', parseError);
        return {
          strengths: [],
          areasToImprove: [],
          redFlags: []
        };
      }
    } catch (error) {
      console.error('Error analyzing job fitment with LLM:', error);
      return {
        strengths: [],
        areasToImprove: [],
        redFlags: []
      };
    }
  }
}

export default LLMService.getInstance();
