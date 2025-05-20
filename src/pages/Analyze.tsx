import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, Award, FileText, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { parseResume } from '@/lib/resume-parser';
import { Skeleton } from "@/components/ui/skeleton";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Analyze = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [skillsField, setSkillsField] = useState('');
  const [experienceField, setExperienceField] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const processResumeFile = async (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setIsParsingResume(true);
        const extractedText = await parseResume(file);
        setResumeText(extractedText);
        
        // Try to extract skills and experience sections based on common headings
        const lowerText = extractedText.toLowerCase();
        
        // Extract potential skills section
        const skillsRegex = /skills?:?[\s\n]+([\s\S]*?)(?=\n\s*\n|\n[A-Z]|\n[a-z]+:|\Z)/i;
        const skillsMatch = extractedText.match(skillsRegex);
        if (skillsMatch && skillsMatch[1]) {
          setSkillsField(skillsMatch[1].trim());
        }
        
        // Extract potential experience section
        const expRegex = /(?:experience|work|employment)[\s\n:]+?([\s\S]*?)(?=\n\s*\n|\n[A-Z]|\n[a-z]+:|\Z)/i;
        const expMatch = extractedText.match(expRegex);
        if (expMatch && expMatch[1]) {
          setExperienceField(expMatch[1].trim());
        }
        
        setResumeUploaded(true);
        setResumeFileName(file.name);
        toast.success("Resume parsed successfully");
      } catch (error) {
        console.error("Error parsing resume:", error);
        toast.error("Failed to parse resume. Please try again.");
      } finally {
        setIsParsingResume(false);
      }
    } else if (file.name.endsWith('.docx')) {
      toast.error("DOCX files are not yet supported. Please upload a PDF.");
    } else {
      toast.error("Unsupported file format. Please upload a PDF file.");
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processResumeFile(e.target.files[0]);
    }
  };
  
  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processResumeFile(file);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/job-matching');
  };
  
  const nextStep = () => {
    setCurrentStep(current => current + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(current => current - 1);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Profile Analysis</h1>
              <p className="text-lg text-gray-600">
                Complete your profile to get personalized job match insights
              </p>
            </div>
            
            {/* Progress Steps */}
            <div className="mb-10">
              <div className="flex justify-between items-center">
                <div className="flex-1 relative">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
                    1
                  </div>
                  <div className="text-center mt-2 text-sm">Resume</div>
                  <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
                    <div className={`h-full ${currentStep >= 2 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
                    2
                  </div>
                  <div className="text-center mt-2 text-sm">Skills</div>
                  <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
                    <div className={`h-full ${currentStep >= 3 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
                    3
                  </div>
                  <div className="text-center mt-2 text-sm">Personal Info</div>
                  <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
                    <div className={`h-full ${currentStep >= 4 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 4 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
                    4
                  </div>
                  <div className="text-center mt-2 text-sm">Questions</div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Step 1: Resume Upload */}
              {currentStep === 1 && (
                <Card className="animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
                        <p className="text-gray-600 mb-6">
                          Upload your resume to help us analyze your skills and experience. Currently supporting PDF files only.
                        </p>
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-skillsync-300 bg-skillsync-50' : 'border-gray-300'}`}
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={handleBrowseClick}
                          style={{ cursor: isParsingResume ? 'wait' : resumeUploaded ? 'default' : 'pointer' }}
                        >
                          {isParsingResume ? (
                            <div className="flex flex-col items-center">
                              <Loader2 className="h-12 w-12 text-skillsync-300 animate-spin mb-4" />
                              <p className="text-lg font-medium">Parsing resume...</p>
                              <p className="text-gray-500 mb-4">This may take a few moments</p>
                            </div>
                          ) : !resumeUploaded ? (
                            <>
                              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                              <Input
                                type="file"
                                id="resume"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                ref={inputRef}
                              />
                              <Label htmlFor="resume">
                                <Button type="button" variant="outline" className="cursor-pointer" onClick={handleBrowseClick}>
                                  Browse Files
                                </Button>
                              </Label>
                            </>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <Check className="h-8 w-8 text-green-600" />
                              </div>
                              <p className="text-lg font-medium">{resumeFileName}</p>
                              <p className="text-gray-500 mb-4">Successfully uploaded</p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setResumeUploaded(false);
                                  setResumeFileName('');
                                  setResumeText('');
                                  setSkillsField('');
                                  setExperienceField('');
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          className="gradient-bg border-none"
                          onClick={nextStep}
                          disabled={!resumeUploaded || isParsingResume}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Step 2: Skills & Experience */}
              {currentStep === 2 && (
                <Card className="animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Skills & Experience</h2>
                        <p className="text-gray-600 mb-6">
                          We've extracted some information from your resume. Please review and edit as needed.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="skills">Technical Skills</Label>
                            <Textarea 
                              id="skills" 
                              placeholder="List your technical skills (e.g., JavaScript, Python, Project Management, etc.)"
                              className="mt-1"
                              rows={4}
                              value={skillsField}
                              onChange={(e) => setSkillsField(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="experience">Work Experience</Label>
                            <Textarea 
                              id="experience" 
                              placeholder="Briefly describe your most relevant work experience"
                              className="mt-1"
                              rows={4}
                              value={experienceField}
                              onChange={(e) => setExperienceField(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label 
                              htmlFor="certifications" 
                              className="flex items-center gap-2"
                            >
                              <Award className="h-4 w-4" /> 
                              Certifications
                            </Label>
                            <Textarea 
                              id="certifications" 
                              placeholder="List any professional certifications you have (e.g., AWS Certified Solutions Architect, PMP, CISSP)"
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="projects">Notable Projects</Label>
                            <Textarea 
                              id="projects" 
                              placeholder="Describe noteworthy projects you've worked on"
                              className="mt-1"
                              rows={4}
                            />
                          </div>
                          
                          <div>
                            <Label 
                              htmlFor="notes" 
                              className="flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" /> 
                              Additional Notes
                            </Label>
                            <Textarea 
                              id="notes" 
                              placeholder="Any additional information or context you'd like to share about your background and career goals"
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          className="gradient-bg border-none"
                          onClick={nextStep}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <Card className="animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <p className="text-gray-600 mb-6">
                          Please provide your contact information.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" className="mt-1" />
                          </div>
                          
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" className="mt-1" />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" className="mt-1" />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" className="mt-1" />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="location">Location (City, State, Country)</Label>
                            <Input id="location" className="mt-1" />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                            <Input id="linkedin" className="mt-1" placeholder="https://linkedin.com/in/yourprofile" />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="github">GitHub Profile (Optional)</Label>
                            <Input id="github" className="mt-1" placeholder="https://github.com/yourusername" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="button" 
                          className="gradient-bg border-none"
                          onClick={nextStep}
                        >
                          Continue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Step 4: Hiring Manager Questions */}
              {currentStep === 4 && (
                <Card className="animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                          <FileText className="mr-2 h-5 w-5" />
                          Hiring Manager Questions
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Please answer these questions from the hiring manager to help us assess your fit for the position.
                        </p>
                        
                        <div className="space-y-5">
                          <div>
                            <Label htmlFor="question1" className="font-medium">
                              1. Describe a challenging technical problem you've solved recently and the approach you took.
                            </Label>
                            <Textarea 
                              id="question1" 
                              className="mt-2"
                              rows={4}
                              placeholder="Please be specific about the problem, your role, and the outcome..."
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="question2" className="font-medium">
                              2. How do you stay updated with the latest developments in your field, and what recent technology or trend are you most excited about?
                            </Label>
                            <Textarea 
                              id="question2" 
                              className="mt-2"
                              rows={4}
                              placeholder="Share your approach to continuous learning and professional development..."
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="question3" className="font-medium">
                              3. What is your experience with high-performance, low-latency systems, and how do you approach optimizing code for performance?
                            </Label>
                            <Textarea 
                              id="question3" 
                              className="mt-2"
                              rows={4}
                              placeholder="Describe your experience and methodology for performance optimization..."
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button 
                          type="submit" 
                          className="gradient-bg border-none"
                        >
                          Submit Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
