
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, User, Check, FileText } from "lucide-react";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { jobDescription } from '@/config/jobDescription';

const JobMatching = () => {
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto-analyze when component mounts
    setIsAnalyzed(true);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Job Matching Analysis</h1>
            <p className="text-lg text-gray-600">
              Comparing your professional profile with the C++ Software Engineer position
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Candidate Profile Summary */}
            <div className="lg:col-span-4">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Your Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">JavaScript</span>
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">React</span>
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">Node.js</span>
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">TypeScript</span>
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">UI/UX</span>
                        <span className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">API Design</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Experience Highlights</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>5+ years of frontend development experience</li>
                        <li>Led a team of 4 developers at TechCorp</li>
                        <li>Implemented responsive design principles</li>
                        <li>Improved site performance by 40%</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Education</h3>
                      <p className="text-gray-600">B.S. Computer Science, University of Technology</p>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="w-full" onClick={() => navigate('/analyze')}>
                        Edit Your Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Job Description & Matching Results */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Job Description Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-skillsync-50 rounded-lg mb-6 flex items-start">
                    <FileText className="h-5 w-5 text-skillsync-700 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{jobDescription.title}</h3>
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="inline-block mr-4">📍 {jobDescription.location}</span>
                        <span className="inline-block mr-4">🏢 {jobDescription.companyDetails.employees} employees</span>
                        <span className="inline-block">💼 Team of {jobDescription.companyDetails.teamSize}</span>
                      </div>
                      <p className="text-sm mb-3">{jobDescription.summary.split('\n\n')[0]}</p>
                    </div>
                  </div>
                  
                  {isAnalyzed && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="p-6 bg-skillsync-100 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">Overall Match Rating</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold mr-4">64%</span>
                          <Progress value={64} className="h-4 flex-1" />
                        </div>
                        <p className="text-gray-600">
                          Your profile shows a partial match for this position. While you have a strong technical background, there are some gaps in required experience with C++ and low-latency programming.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Computer Science Fundamentals</span>
                              <span>85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">C++ Programming</span>
                              <span>40%</span>
                            </div>
                            <Progress value={40} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Low-Latency Development</span>
                              <span>30%</span>
                            </div>
                            <Progress value={30} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Team Collaboration</span>
                              <span>90%</span>
                            </div>
                            <Progress value={90} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Software Engineering Practices</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Strong computer science background</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Proven leadership experience</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Performance optimization experience</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Team collaboration and communication</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="mr-2 h-5 w-5 text-yellow-500">!</span>
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                              <span>Limited C++ programming experience</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                              <span>No specific low-latency system experience</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                              <span>Experience in different industry (frontend vs trading)</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-3">Recommendation</h3>
                        <p className="text-gray-700">
                          While you have strong technical fundamentals, this position requires specific expertise in C++ and low-latency systems that isn't evident in your profile. Consider highlighting any relevant C++ projects you've worked on, even if they were academic or personal. Your team leadership and performance optimization experience are valuable transferable skills to emphasize.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobMatching;
