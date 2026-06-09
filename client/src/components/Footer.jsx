import React from 'react';
import { Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-brand-500" />
            <span className="text-sm font-semibold text-slate-300">BrewVote</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {currentYear} BrewVote. All rights reserved. Built for coffee enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
