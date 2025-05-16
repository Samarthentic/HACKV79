
import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-talentsleuth/90 to-talentsleuth-dark text-white pt-24 pb-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                Find Your <span className="text-talentsleuth-accent">Perfect Match</span> with AI
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-xl">
                TalentSleuth AI analyzes your resume and matches you with the ideal job opportunities using advanced machine learning.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload">
                <Button size="lg" className="bg-white text-talentsleuth hover:bg-white/90 group w-full sm:w-auto">
                  <Upload className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  Upload Resume
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                  <ChevronRight className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-sm opacity-80">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center">JS</div>
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">AM</div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">KP</div>
              </div>
              <p>Join 2,500+ candidates who found their dream job</p>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-talentsleuth-dark/40 to-transparent rounded-lg"></div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-talentsleuth-accent/20 rounded-full flex items-center justify-center">
                    <Upload className="h-6 w-6 text-talentsleuth-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium">Resume Uploaded</h3>
                    <p className="text-sm opacity-70">resume_john.pdf</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-talentsleuth-accent w-[85%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Match score</span>
                    <span className="font-medium">85%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 rounded-md">
                    <p className="opacity-70">Skills match</p>
                    <p className="font-medium text-lg">92%</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-md">
                    <p className="opacity-70">Experience match</p>
                    <p className="font-medium text-lg">78%</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs">JavaScript</div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs">React</div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs">TypeScript</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-talentsleuth-accent/40 filter blur-3xl"></div>
        <div className="absolute -left-20 top-1/2 w-60 h-60 rounded-full bg-blue-400/30 filter blur-3xl"></div>
      </div>
    </section>
  );
};

export default Hero;
