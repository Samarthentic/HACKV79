
import React, { createContext, useContext, useState, useEffect } from 'react';
import llmService from '@/services/llm/llmService';
import { toast } from '@/hooks/use-toast';

interface LlmContextType {
  isConfigured: boolean;
  isProcessing: boolean;
  configureApiKey: (apiKey: string) => void;
  clearApiKey: () => void;
}

const LlmContext = createContext<LlmContextType>({
  isConfigured: false,
  isProcessing: false,
  configureApiKey: () => {},
  clearApiKey: () => {},
});

export const useLlm = () => useContext(LlmContext);

export const LlmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Initialize on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('llm_api_key');
    if (storedKey) {
      try {
        llmService.setApiKey(storedKey);
        setIsConfigured(true);
      } catch (error) {
        console.error("Error initializing LLM service:", error);
        localStorage.removeItem('llm_api_key');
      }
    }
  }, []);

  const configureApiKey = (apiKey: string) => {
    try {
      setIsProcessing(true);
      localStorage.setItem('llm_api_key', apiKey);
      llmService.setApiKey(apiKey);
      setIsConfigured(true);
      toast({
        title: "AI Integration Active",
        description: "Using GPT-4o for maximum analysis accuracy",
      });
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: error instanceof Error ? error.message : "Failed to configure API key",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('llm_api_key');
    setIsConfigured(false);
    toast({
      title: "AI Integration Disabled",
      description: "Your API key has been removed",
    });
  };

  return (
    <LlmContext.Provider value={{ 
      isConfigured,
      isProcessing,
      configureApiKey,
      clearApiKey
    }}>
      {children}
    </LlmContext.Provider>
  );
};
