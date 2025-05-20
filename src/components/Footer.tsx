
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="w-full md:w-1/2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">SkillSync</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Empowering candidates to match their skills with the perfect job opportunities.
            </p>
          </div>
          
          <div className="w-full md:w-1/3">
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-skillsync-300">Home</Link></li>
              <li><Link to="/analyze" className="text-gray-600 hover:text-skillsync-300">Analyze</Link></li>
              <li><Link to="/job-matching" className="text-gray-600 hover:text-skillsync-300">Job Matching</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
