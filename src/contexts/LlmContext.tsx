
import React, { createContext, useContext, useState, useEffect } from 'react';
import llmService from '@/services/llm/llmService';

interface LlmContextType {
  isConfigured: boolean;
  configureApiKey: (apiKey: string) => void;
}

const LlmContext = createContext<LlmContextType>({
  isConfigured: false,
  configureApiKey: () => {},
});

export const useLlm = () => useContext(LlmContext);

export const LlmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  // Initialize on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('llm_api_key');
    if (storedKey) {
      llmService.setApiKey(storedKey);
      setIsConfigured(true);
    }
  }, []);

  const configureApiKey = (apiKey: string) => {
    localStorage.setItem('llm_api_key', apiKey);
    llmService.setApiKey(apiKey);
    setIsConfigured(true);
  };

  return (
    <LlmContext.Provider value={{ 
      isConfigured,
      configureApiKey 
    }}>
      {children}
    </LlmContext.Provider>
  );
};
