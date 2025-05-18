
/**
 * Base service for handling LLM API connections and configuration
 */
export class LLMBaseService {
  private static instance: LLMBaseService;
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1';
  
  // Model configuration
  protected MODEL = 'gpt-4o';
  protected MAX_TOKENS = 4000;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): LLMBaseService {
    if (!LLMBaseService.instance) {
      LLMBaseService.instance = new LLMBaseService();
    }
    return LLMBaseService.instance;
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
  protected async makeRequest(endpoint: string, body: any): Promise<any> {
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
}

export default LLMBaseService.getInstance();
