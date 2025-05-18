
import { JobListing } from '../jobsData';

/**
 * Interface for job match results
 */
export interface JobMatch {
  job: JobListing;
  fitPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
}
