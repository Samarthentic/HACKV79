
/**
 * Job listings data store
 */
export interface JobListing {
  title: string;
  company?: string;
  description: string;
  location?: string;
  salaryRange?: string;
}

export const jobsData: JobListing[] = [
  {
    title: "Software Engineer",
    company: "Tech Innovations Inc.",
    description: `We are seeking a skilled Software Engineer to design, develop, and maintain software applications. The ideal candidate will write efficient code, troubleshoot issues, and collaborate with teams to deliver high-quality solutions.

Responsibilities:
- Develop, test, and deploy software applications.
- Write clean, maintainable, and scalable code.
- Collaborate with cross-functional teams to define and implement features.
- Troubleshoot and debug issues for optimal performance.
- Stay updated with emerging technologies and best practices.

Qualifications:
- Bachelor's degree in Computer Science or a related field.
- Proficiency in programming languages like Python, Java, or C++.
- Experience with databases, web development, and software frameworks.
- Strong problem-solving skills and attention to detail.
- Ability to work both independently and in a team environment.`,
    location: "San Francisco, CA",
    salaryRange: "$120K - $150K",
  },
  {
    title: "Data Scientist",
    company: "Data Insights Corp",
    description: `We are looking for a skilled Data Scientist to analyze complex datasets, develop predictive models, and provide actionable insights. You will collaborate with cross-functional teams to optimize business strategies and drive data-driven decision-making.

Responsibilities:
- Collect, clean, and analyze large datasets.
- Develop and deploy machine learning models.
- Build predictive analytics solutions to improve business outcomes.
- Communicate findings through reports and visualizations.
- Stay updated with advancements in data science and AI.

Qualifications:
- Bachelor's or Master's degree in Data Science, Computer Science, or a related field.
- Proficiency in Python, R, SQL, and machine learning frameworks.
- Experience with data visualization tools like Tableau or Power BI.
- Strong analytical and problem-solving skills.
- Ability to work independently and in a team environment.`,
    location: "Boston, MA",
    salaryRange: "$130K - $160K",
  },
  {
    title: "Product Manager",
    company: "Innovation Products",
    description: `We are seeking an innovative and strategic Product Manager to lead the development and execution of new products. The ideal candidate will collaborate with cross-functional teams to define product roadmaps, analyze market trends, and ensure successful product launches.

Responsibilities:
- Define product vision and strategy based on market research and customer needs.
- Work closely with engineering, design, and marketing teams to develop and launch products.
- Prioritize features, create roadmaps, and manage product lifecycle.
- Analyze user feedback and data to optimize product performance.
- Ensure alignment between business goals and product development.

Qualifications:
- Bachelor's degree in Business, Computer Science, or a related field.
- Experience in product management, agile methodologies, and market research.
- Strong analytical, leadership, and communication skills.
- Familiarity with project management tools and data-driven decision-making.`,
    location: "New York, NY",
    salaryRange: "$115K - $145K",
  },
  {
    title: "Cloud Engineer",
    company: "CloudTech Systems",
    description: `We are looking for a skilled Cloud Engineer to design, implement, and manage cloud-based infrastructure. You will optimize performance, enhance security, and ensure scalability while collaborating with development teams to deploy cloud solutions efficiently.

Responsibilities:
- Design and maintain cloud architecture for high availability and security.
- Automate deployments and manage CI/CD pipelines.
- Monitor cloud systems, troubleshoot issues, and optimize costs.
- Implement security best practices and compliance measures.

Qualifications:
- Bachelor's degree in Computer Science, IT, or related field.
- Experience with cloud platforms like AWS, Azure, or Google Cloud.
- Proficiency in infrastructure-as-code (Terraform, CloudFormation).
- Strong scripting skills in Python, Bash, or PowerShell.`,
    location: "Remote",
    salaryRange: "$125K - $155K",
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet Defense",
    description: `We are looking for a skilled Cybersecurity Analyst to protect our organization's systems and data from cyber threats. You will monitor networks, analyze security incidents, and implement protective measures to ensure compliance and data integrity.

Responsibilities:
- Monitor and analyze security alerts to detect potential threats.
- Conduct vulnerability assessments and risk analysis.
- Implement security policies, firewalls, and encryption protocols.
- Investigate and respond to security breaches.
- Ensure compliance with cybersecurity regulations and best practices.

Qualifications:
- Bachelor's degree in Cybersecurity, Computer Science, or related field.
- Experience with security tools like SIEM, firewalls, and intrusion detection systems.
- Knowledge of network security, encryption, and risk management.
- Strong analytical and problem-solving skills.
- Certifications like CEH, CISSP, or CompTIA Security+ are a plus.`,
    location: "Washington, DC",
    salaryRange: "$110K - $140K",
  },
  {
    title: "Machine Learning Engineer",
    company: "AI Innovations",
    description: `We are looking for a skilled Machine Learning Engineer to develop, train, and deploy AI models for real-world applications. You will work with large datasets, optimize algorithms, and collaborate with cross-functional teams to drive innovation.

Responsibilities:
- Develop and optimize machine learning models for various applications.
- Process and analyze large datasets to extract meaningful insights.
- Deploy and maintain AI models in production environments.
- Collaborate with data scientists, engineers, and product teams.
- Stay updated with the latest advancements in AI and ML.

Qualifications:
- Bachelor's or Master's in Computer Science, Data Science, or a related field.
- Proficiency in Python, TensorFlow, PyTorch, and Scikit-learn.
- Experience with data preprocessing, model deployment, and cloud platforms.
- Strong problem-solving skills and analytical mindset.`,
    location: "Seattle, WA",
    salaryRange: "$140K - $170K",
  },
  {
    title: "DevOps Engineer",
    company: "Continuous Solutions",
    description: `We are seeking a skilled DevOps Engineer to streamline development, deployment, and operations. You will be responsible for automating infrastructure, improving CI/CD pipelines, and ensuring system reliability, security, and scalability.

Responsibilities:
- Develop and maintain CI/CD pipelines for seamless deployment.
- Automate infrastructure management using tools like Terraform or Ansible.
- Monitor system performance and ensure high availability.
- Collaborate with development and operations teams to optimize workflows.
- Implement security best practices and ensure compliance.

Qualifications:
- Bachelor's degree in Computer Science, IT, or related field.
- Proficiency in cloud platforms (AWS, Azure, or Google Cloud).
- Experience with containerization (Docker, Kubernetes).
- Strong scripting skills (Python, Bash, or PowerShell).
- Knowledge of configuration management tools (Ansible, Chef, or Puppet).`,
    location: "Austin, TX",
    salaryRange: "$120K - $150K",
  },
  {
    title: "Full Stack Developer",
    company: "Web Solutions Inc",
    description: `We are looking for a skilled Full Stack Developer to design, develop, and maintain web applications. You will work on both frontend and backend development, ensuring seamless user experiences and optimized performance.

Responsibilities:
- Develop and maintain web applications using modern frontend and backend technologies.
- Collaborate with designers and backend engineers to implement new features.
- Optimize application performance and ensure scalability.
- Troubleshoot and debug issues in a fast-paced environment.
- Stay updated with emerging web technologies and best practices.

Qualifications:
- Bachelor's degree in Computer Science or related field (or equivalent experience).
- Proficiency in JavaScript, React, Node.js, and databases (SQL/NoSQL).
- Experience with RESTful APIs, cloud services, and version control (Git).
- Strong problem-solving skills and ability to work in a collaborative team.`,
    location: "Chicago, IL",
    salaryRange: "$100K - $130K",
  },
  {
    title: "Big Data Engineer",
    company: "DataScale Technologies",
    description: `We are seeking a skilled Big Data Engineer to design, develop, and maintain scalable data pipelines for processing and analyzing large datasets. You will work with distributed computing technologies to optimize data workflows and support data-driven decision-making.

Responsibilities:
- Design and implement data pipelines for large-scale processing.
- Optimize data storage and retrieval for performance and scalability.
- Work with cloud-based and on-premises big data technologies.
- Ensure data security, integrity, and compliance.
- Collaborate with data scientists and analysts to support business needs.

Qualifications:
- Bachelor's/Master's degree in Computer Science, Data Engineering, or related field.
- Experience with Hadoop, Spark, Kafka, and distributed computing.
- Proficiency in SQL, Python, or Scala for data processing.
- Knowledge of cloud platforms like AWS, Azure, or GCP.
- Strong problem-solving and analytical skills.`,
    location: "San Jose, CA",
    salaryRange: "$130K - $160K",
  },
  {
    title: "AI Researcher",
    company: "Innovation Research Labs",
    description: `We are seeking an innovative AI Researcher to develop cutting-edge AI models and algorithms. You will work on advancing machine learning techniques, optimizing AI systems, and applying research to real-world applications.

Responsibilities:
- Conduct research in AI, deep learning, and NLP.
- Develop and optimize machine learning models.
- Publish findings in top-tier conferences and journals.
- Collaborate with cross-functional teams to integrate AI solutions.
- Stay updated with the latest AI advancements and technologies.

Qualifications:
- Ph.D. or Master's in AI, Machine Learning, or related field.
- Strong programming skills in Python, TensorFlow, or PyTorch.
- Experience with research methodologies and model optimization.
- Excellent problem-solving and analytical skills.`,
    location: "Palo Alto, CA",
    salaryRange: "$150K - $180K",
  },
];
