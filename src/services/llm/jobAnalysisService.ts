
import { ParsedResume } from '../resume/types';
import { JobMatch } from '../jobs/jobMatching';
import llmBaseService from './llmBaseService';

// Defining the type for LLM analysis results to ensure type safety
export type LlmAnalysisData = {
  strengths: string[];
  areasToImprove: string[];
  redFlags: Array<{severity: "high" | "medium" | "low"; issue: string; impact: string;}>;
}

/**
 * Service for analyzing job fitment with LLM
 */
export class JobAnalysisService {
  private static instance: JobAnalysisService;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): JobAnalysisService {
    if (!JobAnalysisService.instance) {
      JobAnalysisService.instance = new JobAnalysisService();
    }
    return JobAnalysisService.instance;
  }

  /**
   * Analyze job fitment with LLM using enhanced analysis techniques
   */
  public async analyzeJobFitment(resume: ParsedResume, jobMatches: JobMatch[]): Promise<LlmAnalysisData> {
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

      const response = await llmBaseService.makeRequest('/chat/completions', {
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a precision-focused career analysis assistant. Return only valid, detailed JSON data.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 4000
      });

      try {
        const content = response.choices[0].message.content;
        // Find JSON content if it's wrapped in markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
        const jsonContent = jsonMatch[1].trim();
        const parsedData = JSON.parse(jsonContent);

        // Ensure the severity is strictly typed
        const typedRedFlags = parsedData.redFlags.map((flag: any) => {
          // Normalize severity to one of the allowed values
          let severity: "high" | "medium" | "low" = "medium";
          if (flag.severity === "high") severity = "high";
          if (flag.severity === "low") severity = "low";
          
          return {
            ...flag,
            severity
          };
        });

        return {
          strengths: parsedData.strengths || [],
          areasToImprove: parsedData.areasToImprove || [],
          redFlags: typedRedFlags || []
        };
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

export default JobAnalysisService.getInstance();
