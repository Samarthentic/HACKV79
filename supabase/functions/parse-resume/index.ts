
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, fileName, fileType } = await req.json();
    
    // Initialize Supabase client with Deno env vars
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch file content from URL
    const response = await fetch(fileUrl);
    const fileContent = await response.text();
    
    // Extract the first 15000 characters for text analysis (to stay within token limits)
    const truncatedContent = fileContent.substring(0, 15000);

    // Configure OpenAI API request
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system', 
            content: `You are an expert resume parser. Extract the following information from the resume text:
              - Full Name
              - Email Address
              - Phone Number
              - Location/Address
              - Skills (as a list of individual skills)
              - Education History (including degree, institution, and years)
              - Work Experience (including job title, company, years, and brief description)
              - Certifications (if any)

              Format your response as a JSON object with the following structure:
              {
                "personalInfo": {
                  "name": "",
                  "email": "",
                  "phone": "",
                  "location": ""
                },
                "skills": ["skill1", "skill2", "..."],
                "education": [
                  {
                    "degree": "",
                    "institution": "",
                    "year": ""
                  }
                ],
                "experience": [
                  {
                    "title": "",
                    "company": "",
                    "period": "",
                    "description": ""
                  }
                ],
                "certifications": [
                  {
                    "name": "",
                    "issuer": "",
                    "year": ""
                  }
                ]
              }
              
              Return ONLY the JSON with no explanations or other text.`
          },
          {
            role: 'user',
            content: `Parse the following resume text extracted from a ${fileType} file named ${fileName}:\n\n${truncatedContent}`
          }
        ]
      })
    });
    
    const openAIData = await openAIResponse.json();
    
    // Extract the JSON content from the OpenAI response
    const parsedResume = JSON.parse(openAIData.choices[0].message.content);

    return new Response(
      JSON.stringify({ 
        success: true, 
        parsedResume 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error parsing resume:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
