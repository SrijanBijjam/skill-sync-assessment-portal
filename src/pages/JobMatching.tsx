
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, User, Check, Search } from "lucide-react";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const JobMatching = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  
  const handleSubmitJob = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzed(true);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Job Matching Analysis</h1>
            <p className="text-lg text-gray-600">
              Compare your professional profile with job descriptions to see how well you match
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
                      <Button variant="outline" className="w-full">
                        Edit Your Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column: Job Description Input & Matching Results */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Job Description Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitJob}>
                    <div className="mb-6">
                      <Textarea 
                        placeholder="Paste a job description here to analyze your match..."
                        className="min-h-[200px]"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="mb-8">
                      <Button 
                        type="submit" 
                        className="gradient-bg border-none"
                        disabled={!jobDescription.trim()}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Analyze Job Match
                      </Button>
                    </div>
                  </form>
                  
                  {isAnalyzed && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="p-6 bg-skillsync-100 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">Overall Match Rating</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold mr-4">85%</span>
                          <Progress value={85} className="h-4 flex-1" />
                        </div>
                        <p className="text-gray-600">
                          Your profile shows a strong match for this position. You have most of the required skills and experience.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">JavaScript</span>
                              <span>95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">React</span>
                              <span>90%</span>
                            </div>
                            <Progress value={90} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">TypeScript</span>
                              <span>80%</span>
                            </div>
                            <Progress value={80} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">UI/UX Design</span>
                              <span>70%</span>
                            </div>
                            <Progress value={70} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">Team Leadership</span>
                              <span>85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
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
                              <span>Strong JavaScript and frontend framework experience</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Proven leadership experience</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Experience with modern development practices</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>Relevant project experience in similar domains</span>
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
                              <span>Limited experience with GraphQL mentioned in job</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                              <span>Could highlight more cloud deployment expertise</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-3">Recommendation</h3>
                        <p className="text-gray-700">
                          You're a strong candidate for this position! Consider highlighting your leadership experience and frontend optimization work in your application. Adding more details about any GraphQL experience would strengthen your application further.
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
