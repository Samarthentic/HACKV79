
/**
 * Check if resume skills contain a matching skill with improved fuzzy matching
 */
export const hasMatchingSkill = (resumeSkills: string[], jobSkill: string): boolean => {
  const normalizedJobSkill = jobSkill.toLowerCase();
  
  // Directly check for exact match or substring match
  const directMatch = resumeSkills.some(skill => {
    const normalizedResumeSkill = skill.toLowerCase();
    return (
      normalizedResumeSkill.includes(normalizedJobSkill) || 
      normalizedJobSkill.includes(normalizedResumeSkill)
    );
  });
  
  if (directMatch) return true;
  
  // Check for related skills (e.g., "React" matches "React.js" or "ReactJS")
  const relatedMatches = {
    "javascript": ["js", "es6", "ecmascript"],
    "typescript": ["ts"],
    "react": ["reactjs", "react.js"],
    "node": ["nodejs", "node.js"],
    "angular": ["angularjs", "angular.js"],
    "amazon web services": ["aws"],
    "google cloud platform": ["gcp"],
    "microsoft azure": ["azure"],
    "continuous integration": ["ci", "ci/cd"],
    "continuous deployment": ["cd", "ci/cd"],
    "machine learning": ["ml"],
    "artificial intelligence": ["ai"],
    "natural language processing": ["nlp"],
    "deep learning": ["dl"],
    "user experience": ["ux"],
    "user interface": ["ui"]
  };
  
  // Check for related skills
  for (const [key, aliases] of Object.entries(relatedMatches)) {
    if (normalizedJobSkill.includes(key) || key.includes(normalizedJobSkill)) {
      // Check if any alias is in resume skills
      const hasRelatedSkill = resumeSkills.some(skill => {
        const normalizedSkill = skill.toLowerCase();
        return aliases.some(alias => normalizedSkill.includes(alias));
      });
      
      if (hasRelatedSkill) return true;
    }
    
    // Check if any alias of job skill is in resume skills
    if (aliases.some(alias => normalizedJobSkill.includes(alias))) {
      const hasKeySkill = resumeSkills.some(skill => {
        const normalizedSkill = skill.toLowerCase();
        return normalizedSkill.includes(key);
      });
      
      if (hasKeySkill) return true;
    }
  }
  
  return false;
};
