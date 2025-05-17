
import { toast } from '@/hooks/use-toast';
import { ParsedResume } from '../resume/types';
import { JobMatch } from '../jobs/jobMatchingService';

// Model configuration - using a more powerful model for accuracy
const MODEL = 'gpt-4o';

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
   * Enhance resume extraction using LLM
   */
  public async enhanceResumeExtraction(resumeText: string, initialExtraction: Partial<ParsedResume>): Promise<Partial<ParsedResume>> {
    try {
      const prompt = `
        You are a professional resume parser. 
        I'll provide you with extracted text from a resume and initial parsed data.
        Please analyze the text and improve or correct the extracted information.
        
        Resume Text:
        ${resumeText.substring(0, 4000)} ${resumeText.length > 4000 ? '...(truncated)' : ''}
        
        Initial Extraction:
        ${JSON.stringify(initialExtraction, null, 2)}
        
        Please provide improved data in valid JSON format only, no explanations.
      `;

      const response = await this.makeRequest('/chat/completions', {
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful resume parsing assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
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
   * Analyze job fitment with LLM
   */
  public async analyzeJobFitment(resume: ParsedResume, jobMatches: JobMatch[]): Promise<{
    strengths: string[];
    areasToImprove: string[];
    redFlags: Array<{severity: string; issue: string; impact: string;}>;
  }> {
    try {
      const prompt = `
        You are a professional career advisor. Based on the resume and job matches below,
        provide a comprehensive analysis including:
        
        1. Top strengths (list of strings)
        2. Areas to improve (list of strings)
        3. Resume red flags (list of objects with severity, issue, and impact properties)
        
        Resume:
        ${JSON.stringify(resume, null, 2)}
        
        Job Matches:
        ${JSON.stringify(jobMatches.slice(0, 3), null, 2)}
        
        Provide the result as a JSON object with keys: strengths, areasToImprove, redFlags.
        Only return valid JSON, no explanations.
      `;

      const response = await this.makeRequest('/chat/completions', {
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful career analysis assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
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
