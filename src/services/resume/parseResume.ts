
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
  preprocessExtractedText
} from './extractors';

/**
 * Parse a resume file by extracting information using NLP techniques
 * @param file The resume file to parse (PDF or DOCX)
 * @returns A promise that resolves to the parsed resume data
 */
export const parseResume = async (file: File): Promise<ParsedResume> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Processing file: ${file.name} (${file.type})`);
      
      // Start with a simulation of processing time for UI feedback
      const processingTime = 2000 + Math.random() * 3000;
      
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
          
          console.log(`Successfully extracted ${textContent.length} characters of text`);
          console.log("Text sample:", textContent.substring(0, 200) + "...");
          
          // Now try to parse the extracted text to get structured resume data
          const parsedResume: ParsedResume = {
            personalInfo: {
              name: extractName(textContent),
              email: extractEmail(textContent),
              phone: extractPhone(textContent),
              location: extractLocation(textContent)
            },
            skills: extractSkills(textContent),
            education: extractEducation(textContent),
            experience: extractExperience(textContent),
            certifications: extractCertifications(textContent)
          };
          
          console.log("Extracted personal info:", parsedResume.personalInfo);
          console.log("Extracted skills:", parsedResume.skills);
          console.log("Extracted education:", parsedResume.education);
          console.log("Extracted experience:", parsedResume.experience);
          
          // Validate the parsed data - if too many fields are empty, consider it a failed parse
          const emptyFields = [
            !parsedResume.personalInfo.name || parsedResume.personalInfo.name === 'Unknown Name',
            !parsedResume.personalInfo.email,
            !parsedResume.personalInfo.phone,
            parsedResume.skills.length === 0,
            parsedResume.education.length === 0,
            parsedResume.experience.length === 0
          ].filter(Boolean).length;
          
          if (emptyFields >= 4) {
            console.warn("Too many empty fields, considering parse failed");
            throw new Error("Failed to extract enough information from resume");
          }
          
          // Post-process the data to ensure better quality
          // Make sure skills are unique and properly formatted
          parsedResume.skills = [...new Set(parsedResume.skills)].map(skill => 
            skill.trim().replace(/\s+/g, ' ').replace(/^[a-z]/, c => c.toUpperCase())
          );
          
          // Log the parsed results
          console.log("Resume parsed successfully:", parsedResume);
          
          toast({
            title: "Resume parsed successfully",
            description: "Your resume has been analyzed and information extracted.",
          });
          
          resolve(parsedResume);
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
