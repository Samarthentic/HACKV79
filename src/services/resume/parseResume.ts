
import { ParsedResume } from './types';
import { resumeTemplates } from './templates';
import { toast } from "@/hooks/use-toast";
import { 
  extractTextFromFile,
  extractName,
  extractEmail,
  extractPhone,
  extractLocation,
  extractSkills,
  extractEducation,
  extractExperience,
  extractCertifications,
  preprocessExtractedText,
  extractSections
} from './extractors';
import llmService from '../llm/llmService';

/**
 * Parse a resume file by extracting information using enhanced NLP techniques
 * @param file The resume file to parse (PDF or DOCX)
 * @returns A promise that resolves to the parsed resume data
 */
export const parseResume = async (file: File): Promise<ParsedResume> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Processing file: ${file.name} (${file.type})`);
      
      // Start with a simulation of processing time for UI feedback
      const processingTime = 1000 + Math.random() * 1000;
      
      setTimeout(async () => {
        try {
          // First, try to extract text from the file
          const rawTextContent = await extractTextFromFile(file);
          
          // Check if we got enough text to parse
          if (!rawTextContent || rawTextContent.length < 100) {
            console.warn("Insufficient text extracted:", rawTextContent);
            throw new Error("Could not extract sufficient text from the resume");
          }
          
          // Process the extracted text to improve quality
          const textContent = preprocessExtractedText(rawTextContent);
          
          // Extract sections to improve contextual understanding
          const sections = extractSections(rawTextContent);
          
          console.log(`Successfully extracted ${textContent.length} characters of text`);
          console.log("Text sample:", textContent.substring(0, 200) + "...");
          console.log("Extracted sections:", Object.keys(sections).map(k => `${k}: ${sections[k].length} chars`));
          
          // Now try to parse the extracted text to get structured resume data
          // Use the extracted sections to provide more context for each extraction
          const initialParsedResume: ParsedResume = {
            personalInfo: {
              name: extractName(sections.header || textContent),
              email: extractEmail(sections.header || textContent),
              phone: extractPhone(sections.header || textContent),
              location: extractLocation(sections.header || textContent)
            },
            skills: extractSkills(sections.skills || textContent),
            education: extractEducation(sections.education || textContent),
            experience: extractExperience(sections.experience || textContent),
            certifications: extractCertifications(sections.certifications || textContent)
          };
          
          console.log("Initial extraction complete:", initialParsedResume);
          
          // Check if we have LLM service configured
          let finalResume = initialParsedResume;
          
          if (llmService.isConfigured()) {
            try {
              toast({
                title: "Enhancing with AI",
                description: "Using AI to improve resume parsing accuracy...",
              });
              
              // Try to enhance the resume with LLM
              const enhancedResume = await llmService.enhanceResumeExtraction(textContent, initialParsedResume);
              
              // Only use enhanced data if it seems valid
              if (enhancedResume && 
                  enhancedResume.personalInfo && 
                  enhancedResume.skills && 
                  enhancedResume.skills.length > 0) {
                console.log("LLM enhancement successful");
                finalResume = enhancedResume as ParsedResume;
              }
            } catch (llmError) {
              console.error("Error enhancing with LLM:", llmError);
              // Continue with the initial extraction if LLM enhancement fails
            }
          } else {
            console.log("LLM not configured, using initial extraction");
          }
          
          // Validate the parsed data - if too many fields are empty, consider it a failed parse
          const emptyFields = [
            !finalResume.personalInfo.name || finalResume.personalInfo.name === 'Unknown Name',
            !finalResume.personalInfo.email,
            !finalResume.personalInfo.phone,
            finalResume.skills.length === 0,
            finalResume.education.length === 0,
            finalResume.experience.length === 0
          ].filter(Boolean).length;
          
          if (emptyFields >= 4) {
            console.warn("Too many empty fields, considering parse failed");
            throw new Error("Failed to extract enough information from resume");
          }
          
          // Post-process the data to ensure better quality
          // Make sure skills are unique and properly formatted
          finalResume.skills = [...new Set(finalResume.skills)].map(skill => 
            skill.trim().replace(/\s+/g, ' ').replace(/^[a-z]/, c => c.toUpperCase())
          );
          
          // Log the parsed results
          console.log("Resume parsed successfully:", finalResume);
          
          toast({
            title: "Resume parsed successfully",
            description: "Your resume has been analyzed and information extracted.",
          });
          
          resolve(finalResume);
        } catch (error) {
          console.error("Error in text parsing:", error);
          
          // Fall back to template if extraction fails
          console.log("Falling back to template data");
          const template = JSON.parse(JSON.stringify(resumeTemplates[Math.floor(Math.random() * resumeTemplates.length)]));
          
          // Add a small random suffix to the name to make it unique
          const suffix = Math.floor(Math.random() * 1000);
          const name = template.personalInfo.name.split(" ");
          template.personalInfo.name = `${name[0]} ${name[1]}-${suffix}`;
          
          toast({
            title: "Using template data",
            description: "We encountered an issue parsing your resume and are using template data instead. You can edit this information on the next screen.",
            variant: "destructive"
          });
          
          resolve(template);
        }
      }, processingTime);
      
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error parsing resume",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      reject(error);
    }
  });
};
