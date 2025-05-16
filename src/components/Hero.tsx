
import React from 'react';
import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="hero" className="relative bg-gradient-to-br from-talentsleuth to-talentsleuth-dark text-white pt-20">
      <div className="container mx-auto py-20 md:py-28 px-6 md:px-12 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Smarter Hiring, <br className="md:hidden" />Powered by AI
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90">
          TalentSleuth AI is a powerful candidate intelligence engine that helps recruiters
          find the best talent faster using advanced artificial intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/upload">
            <Button size="lg" className="bg-white text-talentsleuth hover:bg-white/90 group">
              <Upload className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Upload Resume
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Learn More
            </Button>
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
