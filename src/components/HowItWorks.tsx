import React from 'react';
const steps = [{
  number: '01',
  title: 'Upload Resumes',
  description: 'Upload candidate resumes individually or in bulk. Our system accepts PDFs, Word documents, and text files.'
}, {
  number: '02',
  title: 'AI Analysis',
  description: 'Our AI engine automatically extracts and analyzes key information, skills, and experience from each resume.'
}, {
  number: '03',
  title: 'Get Intelligent Matches',
  description: 'Receive AI-powered candidate matches ranked by fit score for your specific job requirements.'
}, {
  number: '04',
  title: 'Make Better Hires',
  description: 'Use our insights to interview with confidence and make data-driven hiring decisions.'
}];
const HowItWorks = () => {
  return <section id="how-it-works" className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <h2 className="section-title text-center">How It Works</h2>
        <p className="section-subtitle text-center">
          Our streamlined process makes it easy to find and hire the best talent for your team.
        </p>
        
        <div className="relative mt-20">
          {/* Connection line */}
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-4 border-talentsleuth-accent shadow-lg relative z-10">
                    <span className="text-xl font-bold text-talentsleuth">{step.number}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mt-6 mb-3 text-talentsleuth">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;