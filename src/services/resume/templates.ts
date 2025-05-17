
import { ParsedResume } from './types';

// Various resume templates for simulation
export const resumeTemplates: ParsedResume[] = [
  {
    personalInfo: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA"
    },
    skills: [
      "JavaScript", "React", "TypeScript", "Node.js", "GraphQL", "AWS", 
      "Product Management", "Agile", "Team Leadership"
    ],
    education: [
      {
        degree: "Master of Science in Computer Science",
        institution: "Stanford University",
        year: "2018 - 2020"
      },
      {
        degree: "Bachelor of Engineering in Software Engineering",
        institution: "University of California, Berkeley",
        year: "2014 - 2018"
      }
    ],
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        period: "2020 - Present",
        description: "Led frontend development for multiple client projects. Improved site performance by 35% through code optimization."
      },
      {
        title: "Software Engineer",
        company: "Innovative Apps LLC",
        period: "2018 - 2020",
        description: "Developed and maintained multiple React applications. Collaborated with design team to implement UI/UX improvements."
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer - Associate",
        issuer: "Amazon Web Services",
        year: "2021"
      },
      {
        name: "Professional Scrum Master I",
        issuer: "Scrum.org",
        year: "2019"
      }
    ]
  },
  {
    personalInfo: {
      name: "Jordan Smith",
      email: "jordan.smith@example.com",
      phone: "(555) 987-6543",
      location: "New York, NY"
    },
    skills: [
      "Python", "Machine Learning", "TensorFlow", "Data Science", "SQL", 
      "Pandas", "NumPy", "Data Visualization", "Deep Learning"
    ],
    education: [
      {
        degree: "PhD in Computer Science",
        institution: "MIT",
        year: "2017 - 2021"
      },
      {
        degree: "Bachelor of Science in Mathematics",
        institution: "Harvard University",
        year: "2013 - 2017"
      }
    ],
    experience: [
      {
        title: "Data Scientist",
        company: "AI Research Labs",
        period: "2021 - Present",
        description: "Leading machine learning projects focused on NLP. Developed models that improved text classification accuracy by 25%."
      },
      {
        title: "Machine Learning Intern",
        company: "Big Tech Co.",
        period: "2020",
        description: "Implemented deep learning models for computer vision tasks. Worked on optimizing neural networks for edge devices."
      }
    ],
    certifications: [
      {
        name: "TensorFlow Developer Certificate",
        issuer: "Google",
        year: "2022"
      },
      {
        name: "Deep Learning Specialization",
        issuer: "Coursera",
        year: "2020"
      }
    ]
  },
  {
    personalInfo: {
      name: "Morgan Lee",
      email: "morgan.lee@example.com",
      phone: "(555) 456-7890",
      location: "Chicago, IL"
    },
    skills: [
      "Digital Marketing", "SEO", "SEM", "Content Strategy", "Social Media Marketing",
      "Google Analytics", "Email Marketing", "CRM", "Adobe Creative Suite"
    ],
    education: [
      {
        degree: "Master of Business Administration, Marketing",
        institution: "Northwestern University",
        year: "2016 - 2018"
      },
      {
        degree: "Bachelor of Arts in Communications",
        institution: "University of Illinois",
        year: "2012 - 2016"
      }
    ],
    experience: [
      {
        title: "Senior Marketing Manager",
        company: "Global Brands Inc.",
        period: "2018 - Present",
        description: "Developed and implemented marketing strategies that increased conversion rates by 40%. Managed a team of 5 marketing specialists."
      },
      {
        title: "Digital Marketing Specialist",
        company: "Marketing Solutions Agency",
        period: "2016 - 2018",
        description: "Created and executed digital campaigns for multiple clients. Achieved a 30% increase in client social media engagement."
      }
    ],
    certifications: [
      {
        name: "Google Analytics Individual Qualification",
        issuer: "Google",
        year: "2020"
      },
      {
        name: "Content Marketing Certification",
        issuer: "HubSpot Academy",
        year: "2019"
      }
    ]
  }
];
