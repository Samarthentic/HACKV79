/**
 * Extract key skills from a job description with improved pattern matching
 */
export const extractJobSkills = (description: string): string[] => {
  const skills = new Set<string>();
  
  // Enhanced skill keywords to look for with more precise patterns
  const skillPatterns = [
    // Programming languages and frameworks
    /\b(?:JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|Go|Swift|Kotlin|Rust|Scala|Perl|Shell|Bash|SQL|HTML|CSS|React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Ruby on Rails)\b/gi,
    
    // Databases
    /\b(?:SQL|MySQL|PostgreSQL|MongoDB|SQLite|Oracle|NoSQL|Firebase|DynamoDB|Cassandra|Redis|Elasticsearch)\b/gi,
    
    // Cloud and devops
    /\b(?:AWS|Azure|GCP|Google Cloud|Heroku|Docker|Kubernetes|CI\/CD|Jenkins|Git|GitHub|GitLab|Terraform|Ansible|Chef|Puppet)\b/gi,
    
    // Data science and AI
    /\b(?:Machine Learning|ML|Deep Learning|DL|AI|NLP|Computer Vision|TensorFlow|PyTorch|Scikit-learn|pandas|NumPy|R|Data Mining|Statistics|Big Data|Data Visualization|Tableau|Power BI)\b/gi,
    
    // Professional skills
    /\b(?:Project Management|Agile|Scrum|Kanban|Leadership|Communication|Problem Solving|Team Management|Critical Thinking|Time Management)\b/gi,
    
    // Security
    /\b(?:Cybersecurity|SIEM|Firewalls|Encryption|Security Analysis|Vulnerability Assessment|Penetration Testing|CISSP|CEH|Security\+)\b/gi,
    
    // Design
    /\b(?:UX|UI|User Experience|User Interface|Figma|Sketch|Adobe XD|Photoshop|Illustrator|Wireframing|Prototyping)\b/gi,
    
    // Blockchain
    /\b(?:Blockchain|Ethereum|Smart Contracts|Solidity|Web3|Cryptocurrency|NFT|DeFi|DApp)\b/gi,
    
    // Mobile
    /\b(?:Android|iOS|Swift|Kotlin|React Native|Flutter|Mobile Development|App Development)\b/gi,
    
    // Networking
    /\b(?:Network|TCP\/IP|DNS|DHCP|VPN|Cisco|Juniper|Routing|Switching|Firewall)\b/gi,
    
    // Business Intelligence
    /\b(?:Business Intelligence|BI|ETL|Data Warehouse|OLAP|OLTP|Dimensional Modeling|Star Schema)\b/gi,
  ];
  
  // Extract skills using patterns
  for (const pattern of skillPatterns) {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Normalize skill (remove extra spaces, make consistent case)
        const normalized = match.trim();
        skills.add(normalized);
      });
    }
  }
  
  return Array.from(skills);
};

/**
 * Extract important job keywords beyond technical skills
 */
export const extractJobKeywords = (description: string): string[] => {
  const keywords = new Set<string>();
  
  // Job role specific keywords
  const keywordPatterns = [
    // Experience levels
    /\b(?:Junior|Senior|Lead|Principal|Entry[ -]Level|Mid[ -]Level|Staff)\b/gi,
    
    // Industry domains
    /\b(?:Finance|Healthcare|E-commerce|Manufacturing|Education|Retail|Energy|Automotive|Entertainment|Government)\b/gi,
    
    // Soft skills and attributes
    /\b(?:Collaborative|Team Player|Self-Motivated|Detail-Oriented|Innovative|Creative|Analytical|Strategic)\b/gi,
    
    // Leadership keywords
    /\b(?:Manage|Lead|Direct|Oversee|Coordinate|Supervise)\b/gi,
    
    // Degree requirements
    /\b(?:Bachelor's|Master's|PhD|Doctorate|Degree)\b/gi
  ];
  
  // Extract keywords using patterns
  for (const pattern of keywordPatterns) {
    const matches = description.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const normalized = match.trim();
        keywords.add(normalized);
      });
    }
  }
  
  return Array.from(keywords);
};

/**
 * Extract fields of study from job description
 */
export const extractFieldsOfStudy = (description: string): string[] => {
  const fields = new Set<string>();
  const fieldPatterns = [
    /(?:degree in|background in|education in) ([A-Za-z ,]+?)(?:or|,|\.|and)/gi,
    /(?:Computer Science|Information Technology|Engineering|Mathematics|Business|Economics|Finance|Marketing)/gi
  ];
  
  for (const pattern of fieldPatterns) {
    const matches = description.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        // If captured group exists, use it
        const field = match[1].trim();
        if (field) fields.add(field);
      } else if (match[0]) {
        // Otherwise use the full match
        fields.add(match[0].trim());
      }
    }
  }
  
  return Array.from(fields);
};
