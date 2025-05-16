
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-talentsleuth rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
              <span className="text-xl font-bold text-white">
                TalentSleuth<span className="text-talentsleuth-accent">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Revolutionizing the way candidates and employers connect through AI-powered matching and insights.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-white text-base uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link to="/upload" className="text-gray-400 hover:text-white transition-colors text-sm">Upload Resume</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              <li><Link to="/job-fitment" className="text-gray-400 hover:text-white transition-colors text-sm">Job Fitment</Link></li>
              <li><Link to="/resume-summary" className="text-gray-400 hover:text-white transition-colors text-sm">Resume Summary</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-white text-base uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-white text-base uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-talentsleuth-accent" />
                <span>123 AI Drive, Tech Valley, CA 94043</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-talentsleuth-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-talentsleuth-accent" />
                <span>contact@talentsleuth.ai</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 mt-12 border-t border-gray-800 text-sm text-center text-gray-500">
          <p>&copy; {currentYear} TalentSleuth AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
