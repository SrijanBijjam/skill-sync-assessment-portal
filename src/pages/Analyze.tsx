import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import our components
import StepProgress from '@/components/analyze/StepProgress';
import ResumeUploadStep from '@/components/analyze/ResumeUploadStep';
import SkillsExperienceStep from '@/components/analyze/SkillsExperienceStep';
import PersonalInfoStep from '@/components/analyze/PersonalInfoStep';
import QuestionsStep from '@/components/analyze/QuestionsStep';
import { useProfileData, PersonalInfo, SkillsExperience, HiringManagerQuestions } from '@/hooks/useProfileData';

const Analyze = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isParsingResume, setIsParsingResume] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    profileData,
    isLoading,
    updateResumeData,
    updateSkillsExperience,
    updatePersonalInfo,
    updateHiringManagerQuestions
  } = useProfileData();
  
  // If we have profile data and are on step 1 with a resume already uploaded, skip to step 2
  useEffect(() => {
    if (!isLoading && profileData.resumeUploaded && currentStep === 1) {
      toast.info("Resuming from your last session");
    }
  }, [isLoading, profileData.resumeUploaded, currentStep]);
  
  const handleResumeStatusChange = (isUploaded: boolean, fileName: string) => {
    setIsParsingResume(!isUploaded && fileName !== '');
    updateResumeData({
      resumeUploaded: isUploaded,
      resumeFileName: fileName,
    });
  };
  
  const handleResumeProcessed = (
    text: string, 
    skills: string, 
    experience: string, 
    projects: string,
    extractedPersonalInfo: PersonalInfo
  ) => {
    // Update resume text
    updateResumeData({
      resumeText: text,
    });
    
    // Update skills and experience
    updateSkillsExperience({
      skills,
      experience,
      projects,
    });
    
    // Update personal info
    updatePersonalInfo(extractedPersonalInfo);
    
    setIsParsingResume(false);
  };
  
  const handleSkillsExperienceSubmit = (data: SkillsExperience) => {
    updateSkillsExperience(data);
  };
  
  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
  };
  
  const handleQuestionsSubmit = async (data: HiringManagerQuestions) => {
    setIsSubmitting(true);
    toast({
      title: "Submitting your profile",
      description: "Please wait while we process your information..."
    });

    // Update the hiring manager questions
    updateHiringManagerQuestions(data);

    // Navigate to job matching page after short delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/job-matching');
    }, 1500);
  };
  
  const nextStep = () => {
    setCurrentStep(current => current + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(current => current - 1);
    window.scrollTo(0, 0);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ResumeUploadStep
            resumeUploaded={profileData.resumeUploaded}
            resumeFileName={profileData.resumeFileName}
            isParsingResume={isParsingResume}
            onResumeProcessed={handleResumeProcessed}
            onResumeStatusChange={handleResumeStatusChange}
            onContinue={nextStep}
          />
        );
      case 2:
        return (
          <SkillsExperienceStep
            initialData={profileData.skillsExperience}
            onSubmit={handleSkillsExperienceSubmit}
            onContinue={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <PersonalInfoStep
            personalInfo={profileData.personalInfo}
            onSubmit={handlePersonalInfoSubmit}
            onContinue={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <QuestionsStep
            initialData={profileData.hiringManagerQuestions}
            onSubmit={handleQuestionsSubmit}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  };
  
  // Show loading state while initially loading profile data
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-skillsync-500 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Build Your Profile</h1>
              <p className="text-gray-600">
                Complete your professional profile to get matched with job opportunities.
              </p>
            </div>

            <StepProgress currentStep={currentStep} />
            
            <div className="mt-8">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillsync-700"></div>
                </div>
              ) : (
                renderStep()
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Analyze;
