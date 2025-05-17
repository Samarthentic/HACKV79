
import { ParsedResume } from './types';

/**
 * Saves parsed resume data to storage
 * @param resumeData The parsed resume data to save
 * @returns A promise that resolves when the data is saved
 */
export const saveResumeData = async (resumeData: ParsedResume): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate saving to a database (1-2 seconds)
    setTimeout(() => {
      console.log("Resume data saved successfully:", resumeData);
      
      // Store in localStorage for local persistence
      try {
        localStorage.setItem('parsedResume', JSON.stringify(resumeData));
        console.log("Resume data saved to localStorage");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      
      resolve();
    }, 1000 + Math.random() * 1000);
  });
};

/**
 * Retrieves previously parsed resume data
 * @returns A promise that resolves to the parsed resume data if available
 */
export const getResumeData = async (): Promise<ParsedResume | null> => {
  return new Promise((resolve) => {
    // Simulate fetching from a database (0.5-1 second)
    setTimeout(() => {
      try {
        const savedData = localStorage.getItem('parsedResume');
        console.log("Retrieved from localStorage:", savedData ? "Data found" : "No data found");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          resolve(parsedData);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.error("Error retrieving from localStorage:", error);
        resolve(null);
      }
    }, 500 + Math.random() * 500);
  });
};
