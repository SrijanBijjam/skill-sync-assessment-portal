import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center">
          <div className="w-full max-w-md">
            <Link to="/" className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">SkillSync</span>
            </Link>
            <p className="mt-4 text-gray-600 text-center">
              Empowering candidates to match their skills with the perfect job opportunities.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
