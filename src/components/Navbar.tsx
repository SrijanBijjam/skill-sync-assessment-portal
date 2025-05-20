
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full py-4 border-b border-gray-100">
      <div className="container-custom">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold">SkillSync</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
