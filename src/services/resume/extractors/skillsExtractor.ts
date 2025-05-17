
/**
 * Enhanced skills extractor for resume data
 * Uses improved pattern matching to extract skills from resume text
 */
import { preprocessExtractedText } from './file';

/**
 * Extract skills from resume text
 * @param text Resume text content
 * @returns Array of skills
 */
export const extractSkills = (text: string): string[] => {
  if (!text) return [];
  
  console.log("Extracting skills from text...");
  
  // Preprocess the text for better extraction
  const processedText = preprocessExtractedText(text);
  
  // Common skills to look for (expanded list)
  const skillPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|Go|Swift|Kotlin|Rust|Scala|Perl|Shell|Bash|SQL)\b/g,
    // Web technologies
    /\b(HTML5?|CSS3?|React|Angular|Vue|Svelte|Next\.js|Node\.js|Express|Redux|GraphQL|REST API|jQuery|Bootstrap|Tailwind|SASS|LESS)\b/g,
    // Databases
    /\b(SQL|MySQL|PostgreSQL|MongoDB|SQLite|Oracle|NoSQL|Firebase|DynamoDB|Cassandra|Redis|Elasticsearch)\b/g,
    // Cloud platforms
    /\b(AWS|Amazon Web Services|Azure|GCP|Google Cloud Platform|Heroku|DigitalOcean|Netlify|Vercel)\b/g,
    // Tools & methodologies
    /\b(Git|GitHub|GitLab|Docker|Kubernetes|CI\/CD|Agile|Scrum|Kanban|TDD|DevOps|Jenkins|Travis CI|CircleCI)\b/g,
    // Design & UI/UX
    /\b(Figma|Sketch|Adobe XD|Photoshop|Illustrator|UI Design|UX Design|Wireframing|Prototyping)\b/g,
    // Data science
    /\b(Machine Learning|ML|Deep Learning|DL|AI|Data Science|NLP|Computer Vision|TensorFlow|PyTorch|Scikit-learn|pandas|NumPy)\b/g,
    // Professional skills
    /\b(Project Management|Team Leadership|Agile|Communication|Problem Solving|Critical Thinking|Time Management|Customer Service)\b/g,
    // Marketing & business
    /\b(SEO|SEM|Content Marketing|Social Media Marketing|Google Analytics|Google Ads|Facebook Ads|Email Marketing|CRM|Sales)\b/g,
    // Mobile development
    /\b(iOS|Android|React Native|Flutter|Swift|Kotlin|Objective-C|Mobile Development|App Development)\b/g,
    // DevOps & infrastructure
    /\b(Linux|Windows|MacOS|Server Administration|Networking|Security|Cybersecurity|Infrastructure|Cloud Computing)\b/g,
    // Testing
    /\b(Testing|QA|Quality Assurance|Unit Testing|Integration Testing|E2E Testing|Jest|Mocha|Chai|Selenium|Cypress)\b/g
  ];
  
  // Extract skills
  const skills = new Set<string>();
  
  // Extract skills using each pattern
  skillPatterns.forEach(pattern => {
    const matches = processedText.match(pattern);
    if (matches) {
      matches.forEach(match => skills.add(match));
    }
  });
  
  // Extract skills from bullet points and lists
  const bulletPointSkills = extractSkillsFromBulletPoints(processedText);
  bulletPointSkills.forEach(skill => skills.add(skill));
  
  // Handle specific skills sections
  if (text.match(/\b(skills|technologies|technical skills|core competencies)\b/i)) {
    const skillsSection = extractSkillsSection(text);
    const sectionSkills = parseSkillsSection(skillsSection);
    sectionSkills.forEach(skill => skills.add(skill));
  }
  
  const result = Array.from(skills);
  console.log(`Extracted ${result.length} skills`);
  
  return result;
};

/**
 * Extract skills from bullet points
 * @param text Resume text
 * @returns Array of skills
 */
function extractSkillsFromBulletPoints(text: string): string[] {
  const bulletPointPatterns = [
    /[•●■◦○◆]\s*([\w\s\/\-\+\#\.]+)/g,
    /[-*]\s*([\w\s\/\-\+\#\.]+)/g,
    /\d+\.\s*([\w\s\/\-\+\#\.]+)/g
  ];
  
  const skills = new Set<string>();
  
  bulletPointPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].length < 30) { // Avoid capturing entire sentences
        skills.add(match[1].trim());
      }
    }
  });
  
  return Array.from(skills);
}

/**
 * Extract the skills section from resume text
 * @param text Resume text
 * @returns Skills section text
 */
function extractSkillsSection(text: string): string {
  const lines = text.split('\n');
  let inSkillsSection = false;
  let skillsSection = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is the start of the skills section
    if (!inSkillsSection && line.match(/\b(skills|technologies|technical skills|core competencies)\b/i)) {
      inSkillsSection = true;
      skillsSection.push(line);
      continue;
    }
    
    // Add lines while in skills section
    if (inSkillsSection) {
      // End of skills section if we encounter another section header
      if (line.match(/\b(experience|education|projects|certifications|references)\b/i) && 
          !line.match(/\b(skills|technologies|technical skills|core competencies)\b/i)) {
        break;
      }
      
      skillsSection.push(line);
    }
  }
  
  return skillsSection.join('\n');
}

/**
 * Parse skills from a skills section
 * @param text Skills section text
 * @returns Array of skills
 */
function parseSkillsSection(text: string): string[] {
  const skills = new Set<string>();
  
  // Look for comma-separated lists
  const commaLists = text.match(/([^,.]+(?:,[^,.]+)+)/g);
  if (commaLists) {
    commaLists.forEach(list => {
      list.split(',').forEach(item => {
        const trimmed = item.trim();
        if (trimmed && trimmed.length < 30 && trimmed.length > 2) {
          skills.add(trimmed);
        }
      });
    });
  }
  
  return Array.from(skills);
}
