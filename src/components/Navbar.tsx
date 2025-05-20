
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="w-full py-4 border-b border-gray-100">
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold">SkillSync</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-skillsync-300 transition-colors">
            Home
          </Link>
          <Link to="/analyze" className="text-gray-700 hover:text-skillsync-300 transition-colors">
            Analyze
          </Link>
          <Link to="/job-matching" className="text-gray-700 hover:text-skillsync-300 transition-colors">
            Job Matching
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:flex">
            Sign In
          </Button>
          <Button className="gradient-bg border-none">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
