
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, ChartBar, LayoutDashboard, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, profile } = useAuth();

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {profile?.email?.split('@')[0] || 'Account'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex w-full">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer flex items-center"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-talentsleuth hover:bg-talentsleuth-dark text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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
            
            {user ? (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-500 mb-2">
                  Signed in as: {profile?.email || user.email}
                </div>
                <Button 
                  onClick={() => signOut()}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/signin">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-talentsleuth hover:bg-talentsleuth-dark text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
