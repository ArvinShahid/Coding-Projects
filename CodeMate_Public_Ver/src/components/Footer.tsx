
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-codemate-darker dark:bg-codemate-darker py-6 mt-16 border-t border-white/10 dark:border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <p className="text-sm text-gray-400 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Personal Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
