
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-talentsleuth">
            TalentSleuth<span className="text-talentsleuth-accent">AI</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <button
            onClick={() => scrollToSection('features')}
            className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
          >
            Contact
          </button>
        </div>

        <div className="hidden md:block">
          <Button 
            className="bg-talentsleuth hover:bg-talentsleuth-dark text-white"
            onClick={() => scrollToSection('hero')}
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-4 py-4 px-6 absolute left-0 right-0">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-talentsleuth-accent transition-colors"
            >
              Contact
            </button>
            <Button 
              className="bg-talentsleuth hover:bg-talentsleuth-dark text-white w-full"
              onClick={() => scrollToSection('hero')}
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
