
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'AI Resume Analysis',
    description: 'Our AI engine extracts key information from resumes with 99% accuracy, identifying skills, experience, and qualifications in seconds.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'Intelligent Matching',
    description: 'Our proprietary algorithms match candidates to positions based on skills, experience, culture fit and potential for growth.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Candidate Scoring',
    description: 'Advanced algorithms score candidates objectively across multiple dimensions, helping you identify top talent quickly.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
  {
    title: 'Bias Detection',
    description: 'Identify and mitigate unconscious bias in your hiring process with our AI-powered bias detection tools.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Predictive Analytics',
    description: 'Predict candidate success and retention with our machine learning models trained on millions of employment outcomes.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: 'Interview Insights',
    description: 'Receive AI-generated interview questions tailored to each candidate and role to assess skills and cultural alignment.',
    icon: (
      <svg className="w-10 h-10 text-talentsleuth-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    )
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center">Powerful Features</h2>
        <p className="section-subtitle text-center">
          Our AI-powered platform delivers comprehensive talent intelligence to transform your hiring process.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-gradient border-none rounded-xl overflow-hidden"
            >
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-bold text-talentsleuth">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
