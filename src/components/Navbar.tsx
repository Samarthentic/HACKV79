
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, ChartBar, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation links with icons
  const navigationLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Upload Resume', path: '/upload', icon: Upload },
    { name: 'Resume Summary', path: '/resume-summary', icon: ChartBar },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Fitment', path: '/job-fitment', icon: ChartBar },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.includes(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-9 w-9 bg-talentsleuth rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
          <span className="text-xl font-bold text-gray-900">
            TalentSleuth<span className="text-talentsleuth-accent">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-gray-700 hover:text-talentsleuth transition-colors flex items-center gap-1.5 ${
                isActive(link.path) ? 'text-talentsleuth font-medium' : ''
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button 
            className="bg-talentsleuth hover:bg-talentsleuth-dark text-white"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-6 absolute left-0 right-0 transition-all animate-fade-in">
          <div className="flex flex-col space-y-5 py-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-gray-700 hover:text-talentsleuth transition-colors flex items-center gap-3 py-2 ${
                  isActive(link.path) ? 'text-talentsleuth font-medium' : ''
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
            <Button 
              className="bg-talentsleuth hover:bg-talentsleuth-dark text-white w-full mt-2"
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
