
import { ParsedResume } from './types';
import { extractTextFromPDF, extractTextFromDOCX, parseExtractedText } from './extractors';
import { resumeTemplates } from './templates';
import { toast } from "@/hooks/use-toast";

/**
 * Parses a resume file by extracting information based on file type
 * @param file The resume file to parse
 * @returns A promise that resolves to the parsed resume data
 */
export const parseResume = async (file: File): Promise<ParsedResume> => {
  return new Promise(async (resolve, reject) => {
    // Log the file being processed
    console.log(`Processing file: ${file.name} (${file.type})`);
    
    try {
      let extractedText = '';
      
      // Determine the file type and extract text accordingly
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        console.log('Processing PDF file');
        try {
          extractedText = await extractTextFromPDF(file);
        } catch (error) {
          console.error("Error extracting PDF text:", error);
          // Fall back to template if PDF extraction fails
          toast({
            title: "PDF parsing issue",
            description: "Using sample data instead. Try a different PDF format if needed.",
          });
          return resolve(getRandomTemplate());
        }
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        console.log('Processing DOCX file');
        try {
          extractedText = await extractTextFromDOCX(file);
        } catch (error) {
          console.error("Error extracting DOCX text:", error);
          // Fall back to template if DOCX extraction fails
          toast({
            title: "DOCX parsing issue",
            description: "Using sample data instead. Try a different document format if needed.",
          });
          return resolve(getRandomTemplate());
        }
      } else {
        // For unsupported file types, return a random template
        console.log('Unsupported file type, using template data');
        toast({
          title: "Unsupported file format",
          description: "Using sample data instead. Please upload a PDF or DOCX file.",
          variant: "destructive"
        });
        return resolve(getRandomTemplate());
      }
      
      // If we have extracted text, parse it
      if (extractedText && extractedText.length > 100) {
        console.log('Extracted text length:', extractedText.length);
        console.log('Sample of extracted text:', extractedText.substring(0, 200) + '...');
        
        try {
          // Parse the extracted text into a structured resume
          const parsedData = parseExtractedText(extractedText);
          
          toast({
            title: "Resume parsed successfully",
            description: "Your resume has been analyzed and information extracted.",
          });
          
          resolve(parsedData);
        } catch (parseError) {
          console.error("Error parsing the extracted text:", parseError);
          // Fall back to a template on parsing error
          toast({
            title: "Error analyzing resume",
            description: "Using sample data instead. The document format may be complex.",
          });
          resolve(getRandomTemplate());
        }
      } else {
        // If we didn't get enough text, use a template
        console.log('Insufficient text extracted, using template');
        toast({
          title: "Not enough text found",
          description: "Using sample data instead. Please check your document formatting.",
        });
        resolve(getRandomTemplate());
      }
      
    } catch (error) {
      console.error('Error in parseResume:', error);
      toast({
        title: "Error parsing resume",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      // Always provide a response, even on errors
      resolve(getRandomTemplate());
    }
  });
};

/**
 * Get a random resume template for fallback
 */
function getRandomTemplate(): ParsedResume {
  // Select a random template and make small modifications
  const template = JSON.parse(JSON.stringify(resumeTemplates[Math.floor(Math.random() * resumeTemplates.length)]));
  
  // Add a small random suffix to the name to make it unique
  const suffix = Math.floor(Math.random() * 1000);
  const name = template.personalInfo.name.split(" ");
  template.personalInfo.name = `${name[0]} ${name[1]}-${suffix}`;
  
  return template;
}
