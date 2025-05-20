
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Briefcase, User, Check, FileText, ShieldAlert } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { jobDescription } from '@/config/jobDescription';
import { useProfileData } from '@/hooks/useProfileData';
import { generateProfileSummary, analyzeJobMatch } from '@/services/openai';

const JobMatching = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData, updateProfileSummary, updateJobMatchAnalysis } = useProfileData();
  
  useEffect(() => {
    // Check if we already have analysis data
    if (profileData.jobMatchAnalysis?.score) {
      setIsAnalyzed(true);
      return;
    }
    
    // Auto-analyze when component mounts if we have profile data
    const hasProfileData = profileData.resumeText || 
                          profileData.skillsExperience.skills || 
                          profileData.personalInfo.name;
    
    if (hasProfileData && !isAnalyzed && !isAnalyzing) {
      handleAnalyze();
    }
  }, [profileData]);
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    toast({
      title: "Analyzing profile",
      description: "Please wait while we analyze your profile against the job description.",
    });
    
    try {
      // Generate profile summary if not already present
      if (!profileData.profileSummary) {
        const summary = await generateProfileSummary(profileData);
        updateProfileSummary(summary);
      }
      
      // Generate job match analysis
      const analysis = await analyzeJobMatch(profileData);
      updateJobMatchAnalysis(analysis);
      
      setIsAnalyzed(true);
      toast({
        title: "Analysis complete",
        description: "Your profile has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "We couldn't complete the analysis. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Default skills for demo if no analysis exists
  const skillsAnalysis = profileData.jobMatchAnalysis?.skillsAnalysis || {
    "Computer Science Fundamentals": 85,
    "C++ Programming": 40,
    "Low-Latency Development": 30,
    "Team Collaboration": 90,
    "Software Engineering Practices": 75
  };
  
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
                  {isAnalyzing ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-skillsync-700 mx-auto mb-4"></div>
                        <p className="text-gray-600">Analyzing your profile...</p>
                      </div>
                    </div>
                  ) : !profileData.profileSummary ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">No profile data found.</p>
                        <Button onClick={() => navigate('/analyze')} variant="default">
                          Create Your Profile
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Profile Summary</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {profileData.profileSummary}
                        </p>
                      </div>
                      
                      {profileData.skillsExperience.skills && (
                        <div>
                          <h3 className="font-medium mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {profileData.skillsExperience.skills.split(',').map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">
                                {skill.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" onClick={() => navigate('/analyze')}>
                          Edit Your Profile
                        </Button>
                      </div>
                    </div>
                  )}
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
                    {isAnalyzing ? (
                      <div className="py-12 flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillsync-700 mx-auto mb-4"></div>
                          <p className="text-lg text-gray-600">Analyzing your profile against job requirements...</p>
                          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                        </div>
                      </div>
                    ) : profileData.jobMatchAnalysis ? (
                      <div className="space-y-8 animate-fade-in">
                        <div className="p-6 bg-skillsync-100 rounded-xl">
                          <h3 className="text-lg font-semibold mb-3">Overall Match Rating</h3>
                          <div className="flex items-center mb-2">
                            <span className="text-2xl font-bold mr-4">{profileData.jobMatchAnalysis.score}%</span>
                            <Progress value={profileData.jobMatchAnalysis.score} className="h-4 flex-1" />
                          </div>
                          <p className="text-gray-600">{profileData.jobMatchAnalysis.summary}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                          <div className="space-y-3">
                            {Object.entries(skillsAnalysis).map(([skill, score], index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{skill}</span>
                                  <span>{score}%</span>
                                </div>
                                <Progress value={score} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <Check className="mr-2 h-5 w-5 text-green-500" />
                              Strengths
                            </h3>
                            <ul className="space-y-2">
                              {profileData.jobMatchAnalysis.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center">
                              <ShieldAlert className="mr-2 h-5 w-5 text-yellow-500" />
                              Areas for Improvement
                            </h3>
                            <ul className="space-y-2">
                              {profileData.jobMatchAnalysis.gaps.map((gap, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                                  <span>{gap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border-t pt-6">
                          <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                          <ul className="space-y-2">
                            {profileData.jobMatchAnalysis.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="mr-2 h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-gray-700">{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-600 mb-6">
                          We need to analyze your profile data against the job description.
                        </p>
                        <Button 
                          onClick={handleAnalyze}
                          className="gradient-bg border-none"
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? 'Analyzing...' : 'Analyze My Profile'}
                        </Button>
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
