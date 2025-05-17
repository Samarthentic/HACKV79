
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import llmService from '@/services/llm/llmService';
import { Shield, AlertTriangle } from 'lucide-react';

interface ApiKeySetupProps {
  onConfigured: () => void;
}

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onConfigured }) => {
  const [apiKey, setApiKey] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Check if we have a stored API key
  React.useEffect(() => {
    const storedKey = localStorage.getItem('llm_api_key');
    if (storedKey) {
      llmService.setApiKey(storedKey);
      onConfigured();
    }
  }, [onConfigured]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || apiKey.trim().length < 10) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Set the API key in the service
      llmService.setApiKey(apiKey);
      
      // Store in localStorage
      localStorage.setItem('llm_api_key', apiKey);
      
      toast({
        title: "API Key Configured",
        description: "Your OpenAI API key has been successfully configured",
      });
      
      // Call the onConfigured callback
      onConfigured();
      
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: error instanceof Error ? error.message : "Failed to configure API key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-talentsleuth/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-talentsleuth/10 to-transparent">
        <CardTitle className="flex items-center gap-2 text-talentsleuth">
          <Shield className="h-6 w-6" />
          Configure AI Integration
        </CardTitle>
        <CardDescription className="text-base">
          Enter your OpenAI API key to enable premium resume analysis and job matching using our advanced AI system
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="api-key">
                OpenAI API Key
              </label>
              <Input
                id="api-key"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <div className="flex items-start gap-2 mt-2">
                <Shield className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <p className="text-xs text-gray-500">
                  Your API key is stored locally in your browser and is never sent to our servers.
                  We use the most capable GPT-4o model for maximum accuracy in resume analysis.
                </p>
              </div>
            </div>
            <Button 
              type="submit" 
              className="bg-talentsleuth hover:bg-talentsleuth-light w-full"
              disabled={isLoading}
            >
              {isLoading ? "Configuring..." : "Configure AI"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col items-start border-t pt-4 gap-3">
        <p className="text-xs text-gray-500">
          Don't have an OpenAI API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="underline">Get one here</a>
        </p>
        <div className="flex items-start gap-2 pb-1">
          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-gray-600">
            <span className="font-medium">Important:</span> Using GPT-4o provides the most accurate analysis but will cost more than other models. We recommend this for professional use cases where precision is critical.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiKeySetup;
