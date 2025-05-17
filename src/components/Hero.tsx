
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="pt-36 pb-24 bg-gradient-to-br from-white to-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Smart Career Decisions Start with <span className="text-talentsleuth">TalentSleuth</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Our AI-powered platform analyzes your resume, matches you with ideal jobs, and helps you stand out to employers. Find your perfect career path today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button 
                  className="bg-talentsleuth hover:bg-talentsleuth-dark text-white px-8 py-6 text-lg"
                  asChild
                >
                  <Link to="/upload">Upload Your Resume</Link>
                </Button>
              ) : (
                <>
                  <Button 
                    className="bg-talentsleuth hover:bg-talentsleuth-dark text-white px-8 py-6 text-lg"
                    asChild
                  >
                    <Link to="/auth">Get Started</Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-talentsleuth text-talentsleuth hover:bg-talentsleuth/10 px-8 py-6 text-lg"
                    asChild
                  >
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/placeholder.svg"
              alt="AI-powered resume analysis" 
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
