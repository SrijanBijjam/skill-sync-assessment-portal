
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Briefcase, User, Check, Search, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/use-local-storage';
import { UserProfile, JobMatch, analyzeJobMatch } from '@/lib/openai';

const JobMatching = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [jobMatch, setJobMatch] = useState<JobMatch | null>(null);
  const navigate = useNavigate();
  
  // Get user profile from local storage
  const [userProfile] = useLocalStorage<Partial<UserProfile>>('skillsync-profile', {});
  
  useEffect(() => {
    // Check if profile exists, if not redirect to analyze page
    if (!userProfile?.personalInfo?.firstName) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile before job matching",
      });
      navigate('/analyze');
    }
  }, [userProfile, navigate]);
  
  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobDescription.trim()) {
      toast({
        title: "Missing Job Description",
        description: "Please paste a job description to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      
      // Call OpenAI to analyze job match
      const matchResults = await analyzeJobMatch(jobDescription, userProfile);
      
      setJobMatch(matchResults);
      setIsAnalyzed(true);
      
    } catch (error) {
      console.error('Error analyzing job match:', error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing this job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Helper function to render skills from the profile
  const renderProfileSkills = () => {
    if (!userProfile?.skills || userProfile.skills.length === 0) {
      return <span className="text-gray-400">No skills listed</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        {userProfile.skills.slice(0, 10).map((skill, index) => (
          <span key={index} className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">
            {skill}
          </span>
        ))}
        {userProfile.skills.length > 10 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            +{userProfile.skills.length - 10} more
          </span>
        )}
      </div>
    );
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
                      {renderProfileSkills()}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Experience Highlights</h3>
                      {userProfile?.experience ? (
                        <p className="text-gray-600">{userProfile.experience}</p>
                      ) : (
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>5+ years of frontend development experience</li>
                          <li>Led a team of 4 developers at TechCorp</li>
                          <li>Implemented responsive design principles</li>
                          <li>Improved site performance by 40%</li>
                        </ul>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Education</h3>
                      <p className="text-gray-600">
                        {userProfile?.education || "B.S. Computer Science, University of Technology"}
                      </p>
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
                        disabled={isAnalyzing}
                      />
                    </div>
                    
                    <div className="mb-8">
                      <Button 
                        type="submit" 
                        className="gradient-bg border-none"
                        disabled={!jobDescription.trim() || isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Analyze Job Match
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                  
                  {isAnalyzed && jobMatch && (
                    <div className="space-y-8 animate-fade-in">
                      <div className="p-6 bg-skillsync-100 rounded-xl">
                        <h3 className="text-lg font-semibold mb-3">Overall Match Rating</h3>
                        <div className="flex items-center mb-2">
                          <span className="text-2xl font-bold mr-4">{jobMatch.overallMatch}%</span>
                          <Progress value={jobMatch.overallMatch} className="h-4 flex-1" />
                        </div>
                        <p className="text-gray-600">
                          {jobMatch.overallMatch >= 80 
                            ? "Your profile shows a strong match for this position. You have most of the required skills and experience."
                            : jobMatch.overallMatch >= 60
                            ? "Your profile shows a good match for this position. You have many of the required skills and experience."
                            : "Your profile shows some matches with this position, but there may be gaps in skills or experience."}
                        </p>
                      </div>
                      
                      {jobMatch.skillsAnalysis && jobMatch.skillsAnalysis.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Skills Analysis</h3>
                          <div className="space-y-3">
                            {jobMatch.skillsAnalysis.map((skill, index) => (
                              <div key={index}>
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{skill.name}</span>
                                  <span>{skill.percentage}%</span>
                                </div>
                                <Progress value={skill.percentage} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <Check className="mr-2 h-5 w-5 text-green-500" />
                            Strengths
                          </h3>
                          <ul className="space-y-2">
                            {jobMatch.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <span className="mr-2 h-5 w-5 text-yellow-500">!</span>
                            Areas for Improvement
                          </h3>
                          <ul className="space-y-2">
                            {jobMatch.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2 h-4 w-4 text-yellow-500 mt-1 flex-shrink-0">!</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-3">Recommendation</h3>
                        <p className="text-gray-700">
                          {jobMatch.recommendation}
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
