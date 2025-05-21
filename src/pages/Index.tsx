
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-16 md:py-24 flex flex-col items-center">
          {/* Main Image */}
          <div className="w-full max-w-3xl mb-12">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80" 
              alt="Professional working on laptop"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
          
          {/* Main Button */}
          <Button asChild size="lg" className="bg-black hover:bg-gray-800 text-white text-xl py-8 px-10">
            <Link to="/analyze">
              Candidate Submission Portal
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
