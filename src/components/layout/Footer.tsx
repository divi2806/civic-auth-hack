
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-brand-purple/20 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-dark flex items-center justify-center text-white text-xs font-bold">
            $
          </div>
          <span className="text-sm font-medium text-gray-400">
            TASK-fi © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-brand-purple transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
