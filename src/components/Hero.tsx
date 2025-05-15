
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload } from 'lucide-react';

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 pt-16"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-talentsleuth-accent blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-talentsleuth-light blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-talentsleuth to-talentsleuth-accent bg-clip-text text-transparent animate-fade-in">
            Smarter Hiring, Powered by AI
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover the perfect candidates with our AI-powered talent intelligence platform that 
            analyzes resumes, matches skills, and predicts job success with unprecedented accuracy.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button 
              className="group btn-primary text-lg py-6 px-8 flex items-center gap-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Upload size={20} />
              <span>Upload Resume</span>
              <ArrowRight 
                className={`ml-1 transition-transform duration-300 ${isHovered ? 'transform translate-x-1' : ''}`} 
                size={20} 
              />
            </Button>
            
            <Button 
              variant="outline" 
              className="text-talentsleuth border-talentsleuth hover:bg-talentsleuth hover:text-white transition-all duration-300 text-lg py-6 px-8"
            >
              Request Demo
            </Button>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row gap-8 justify-center items-center text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-talentsleuth-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Matching</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-talentsleuth-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Bias-Free Screening</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-talentsleuth-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Predictive Analytics</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,192C840,181,960,139,1080,128C1200,117,1320,139,1380,149.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
