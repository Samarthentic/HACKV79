
import { ParsedResume } from './types';
import { resumeTemplates } from './templates';
import { toast } from "@/hooks/use-toast";

/**
 * Simulates parsing a resume file by extracting information
 * @param file The resume file to parse
 * @returns A promise that resolves to the parsed resume data
 */
export const parseResume = async (file: File): Promise<ParsedResume> => {
  return new Promise((resolve, reject) => {
    // Log the file being processed
    console.log(`Processing file: ${file.name} (${file.type})`);
    
    // Simulate processing time (2-5 seconds)
    const processingTime = 2000 + Math.random() * 3000;
    
    setTimeout(() => {
      try {
        // Simulate a success rate of 90%
        if (Math.random() > 0.1) {
          // Select a random template and make small modifications
          const template = JSON.parse(JSON.stringify(resumeTemplates[Math.floor(Math.random() * resumeTemplates.length)]));
          
          // Add a small random suffix to the name to make it unique
          const suffix = Math.floor(Math.random() * 1000);
          const name = template.personalInfo.name.split(" ");
          template.personalInfo.name = `${name[0]} ${name[1]}-${suffix}`;
          
          toast({
            title: "Resume parsed successfully",
            description: "Your resume has been analyzed and information extracted.",
          });
          
          resolve(template);
        } else {
          // Simulate an error in 10% of cases
          throw new Error("Could not parse resume format");
        }
      } catch (error) {
        toast({
          title: "Error parsing resume",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive"
        });
        reject(error);
      }
    }, processingTime);
  });
};
