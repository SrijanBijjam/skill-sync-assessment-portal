
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { parseResume } from "@/lib/resume-parser";
import { analyzeResume, UserProfile } from "@/lib/openai";
import useLocalStorage from "@/hooks/use-local-storage";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Analyze = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Form state
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  
  // Local storage for profile data
  const [userProfile, setUserProfile] = useLocalStorage<Partial<UserProfile>>('skillsync-profile', {});
  
  // Load profile data on component mount
  React.useEffect(() => {
    if (userProfile) {
      if (userProfile.skills) setSkills(userProfile.skills.join(', '));
      if (userProfile.experience) setExperience(userProfile.experience);
      if (userProfile.projects) setProjects(userProfile.projects);
      
      if (userProfile.personalInfo) {
        const { personalInfo } = userProfile;
        setFirstName(personalInfo.firstName || '');
        setLastName(personalInfo.lastName || '');
        setEmail(personalInfo.email || '');
        setPhone(personalInfo.phone || '');
        setLocation(personalInfo.location || '');
        setLinkedin(personalInfo.linkedin || '');
        setGithub(personalInfo.github || '');
      }
    }
  }, [userProfile]);
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeUploaded(true);
      setResumeFileName(file.name);
      setResumeFile(file);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
        setResumeUploaded(true);
        setResumeFileName(file.name);
        setResumeFile(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Only PDF and DOCX files are accepted.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };
  
  const processResume = async () => {
    if (!resumeFile) return;
    
    try {
      setIsLoading(true);
      const resumeText = await parseResume(resumeFile);
      const profileData = await analyzeResume(resumeText);
      
      // Update form fields with extracted data
      if (profileData.skills) setSkills(profileData.skills.join(', '));
      if (profileData.experience) setExperience(profileData.experience);
      if (profileData.education) {
        setUserProfile({
          ...userProfile,
          education: profileData.education,
          resumeText,
          skills: profileData.skills || [],
          experience: profileData.experience || '',
          projects: profileData.projects || ''
        });
      }
      
      toast({
        title: "Resume Processed",
        description: "Your resume has been analyzed successfully.",
      });
      
      nextStep();
    } catch (error) {
      console.error('Error processing resume:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save all profile data to local storage
    setUserProfile({
      ...userProfile,
      personalInfo: {
        firstName,
        lastName,
        email,
        phone,
        location,
        linkedin,
        github
      },
      skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      experience,
      projects
    });
    
    navigate('/job-matching');
  };
  
  const nextStep = () => {
    // Save data for current step
    if (currentStep === 1 && resumeFile) {
      processResume();
      return;
    } else if (currentStep === 2) {
      setUserProfile({
        ...userProfile,
        skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        experience,
        projects
      });
    }
    
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
                
                <div className="flex-1">
                  <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
                    3
                  </div>
                  <div className="text-center mt-2 text-sm">Personal Info</div>
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
                          Upload your resume to help us analyze your skills and experience. Accepted formats: PDF, DOCX.
                        </p>
                        <div
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-skillsync-300 bg-skillsync-50' : 'border-gray-300'}`}
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={!resumeUploaded ? handleBrowseClick : undefined}
                          style={{ cursor: resumeUploaded ? 'default' : 'pointer' }}
                        >
                          {!resumeUploaded ? (
                            <>
                              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                              <Input
                                type="file"
                                id="resume"
                                className="hidden"
                                accept=".pdf,.docx"
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
                                  setResumeFile(null);
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
                          disabled={!resumeUploaded || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Processing Resume...
                            </>
                          ) : (
                            'Continue'
                          )}
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
                          Tell us more about your professional skills and experience.
                        </p>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="skills">Technical Skills</Label>
                            <Textarea 
                              id="skills" 
                              placeholder="List your technical skills separated by commas (e.g., JavaScript, Python, Project Management)"
                              className="mt-1"
                              rows={4}
                              value={skills}
                              onChange={(e) => setSkills(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="experience">Work Experience</Label>
                            <Textarea 
                              id="experience" 
                              placeholder="Briefly describe your most relevant work experience"
                              className="mt-1"
                              rows={4}
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="projects">Notable Projects</Label>
                            <Textarea 
                              id="projects" 
                              placeholder="Describe noteworthy projects you've worked on"
                              className="mt-1"
                              rows={4}
                              value={projects}
                              onChange={(e) => setProjects(e.target.value)}
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
                            <Input 
                              id="firstName" 
                              className="mt-1" 
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input 
                              id="lastName" 
                              className="mt-1" 
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              className="mt-1"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone" 
                              className="mt-1"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="location">Location (City, State, Country)</Label>
                            <Input 
                              id="location" 
                              className="mt-1"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                            <Input 
                              id="linkedin" 
                              className="mt-1" 
                              placeholder="https://linkedin.com/in/yourprofile"
                              value={linkedin}
                              onChange={(e) => setLinkedin(e.target.value)}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor="github">GitHub Profile (Optional)</Label>
                            <Input 
                              id="github" 
                              className="mt-1" 
                              placeholder="https://github.com/yourusername"
                              value={github}
                              onChange={(e) => setGithub(e.target.value)}
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
