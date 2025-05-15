import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, Upload, ChartBar, LayoutDashboard, Contact } from 'lucide-react';
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
    // If we're on the home page, scroll to the section
    if (window.location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setMobileMenuOpen(false);
  };

  // Navigation links with icons
  const navigationLinks = [{
    name: 'Home',
    path: '/',
    icon: Home
  }, {
    name: 'Upload Resume',
    path: '/upload',
    icon: Upload
  }, {
    name: 'Resume Summary',
    path: '/resume-summary',
    icon: ChartBar
  }, {
    name: 'Job Fitment',
    path: '/job-fitment',
    icon: LayoutDashboard
  }, {
    name: 'Contact',
    path: '/#contact',
    icon: Contact,
    isAnchor: true
  }];
  return <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center rounded-none bg-white">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-talentsleuth">
            TalentSleuth<span className="text-talentsleuth-accent">AI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navigationLinks.map(link => <div key={link.name}>
              {link.isAnchor ? <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-talentsleuth-accent transition-colors flex items-center gap-1">
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </button> : <Link to={link.path} className="text-gray-700 hover:text-talentsleuth-accent transition-colors flex items-center gap-1">
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>}
            </div>)}
        </div>

        <div className="hidden md:block">
          <Button className="bg-talentsleuth hover:bg-talentsleuth-dark text-white">
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-4 py-4 px-6 absolute left-0 right-0">
          <div className="flex flex-col space-y-4">
            {navigationLinks.map(link => <div key={link.name}>
                {link.isAnchor ? <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-talentsleuth-accent transition-colors flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </button> : <Link to={link.path} className="text-gray-700 hover:text-talentsleuth-accent transition-colors flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>}
              </div>)}
            <Button className="bg-talentsleuth hover:bg-talentsleuth-dark text-white w-full">
              Sign In
            </Button>
          </div>
        </div>}
    </nav>;
};
export default Navbar;