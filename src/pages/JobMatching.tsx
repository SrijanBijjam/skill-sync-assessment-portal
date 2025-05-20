
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
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
              Comparing your professional profile with the {jobDescription.title} position
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
              <div className="space-y-6">
                {/* Complete Job Description Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <Briefcase className="mr-2 h-5 w-5" />
                      Complete Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-skillsync-700">{jobDescription.title}</h2>
                          <p className="text-gray-600 mt-1">{jobDescription.location}</p>
                        </div>
                        <div className="bg-skillsync-100 text-skillsync-700 px-4 py-2 rounded-md text-center">
                          <span className="font-bold">{jobDescription.compensation}</span>
                          <p className="text-sm">Compensation</p>
                        </div>
                      </div>
                      
                      <div className="bg-skillsync-50 p-4 rounded-md">
                        <h3 className="font-semibold text-lg mb-3">Company Details</h3>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium w-1/3">Employees</TableCell>
                              <TableCell>{jobDescription.companyDetails.employees}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Team Size</TableCell>
                              <TableCell>{jobDescription.companyDetails.teamSize}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Industry</TableCell>
                              <TableCell>{jobDescription.companyDetails.industry}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Reports To</TableCell>
                              <TableCell>{jobDescription.companyDetails.reportsTo}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Summary</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{jobDescription.summary}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Key Responsibilities</h3>
                        <ul className="space-y-2">
                          {jobDescription.responsibilities.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="bg-skillsync-100 text-skillsync-700 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">{index + 1}</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {jobDescription.requirements.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="text-green-500 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-skillsync-50 p-4 rounded-md">
                        <h3 className="font-semibold text-lg mb-2">Benefits</h3>
                        <p className="text-gray-700">{jobDescription.benefits}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              
                {/* Analysis Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Job Match Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JobMatching;
