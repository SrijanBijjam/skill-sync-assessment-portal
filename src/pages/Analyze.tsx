
import React, { useEffect } from 'react';
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
  
  const handleQuestionsSubmit = (data: HiringManagerQuestions) => {
    updateHiringManagerQuestions(data);
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
            <StepProgress currentStep={currentStep} />
            
            <div className="form-container">
              {/* Step 1: Resume Upload */}
              {currentStep === 1 && (
                <ResumeUploadStep
                  resumeUploaded={profileData.resumeUploaded}
                  resumeFileName={profileData.resumeFileName}
                  isParsingResume={isParsingResume}
                  onResumeProcessed={handleResumeProcessed}
                  onResumeStatusChange={handleResumeStatusChange}
                  onContinue={nextStep}
                />
              )}
              
              {/* Step 2: Skills & Experience */}
              {currentStep === 2 && (
                <SkillsExperienceStep
                  initialData={profileData.skillsExperience}
                  onSubmit={handleSkillsExperienceSubmit}
                  onContinue={nextStep}
                  onBack={prevStep}
                />
              )}
              
              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <PersonalInfoStep
                  personalInfo={profileData.personalInfo}
                  onSubmit={handlePersonalInfoSubmit}
                  onContinue={nextStep}
                  onBack={prevStep}
                />
              )}
              
              {/* Step 4: Questions */}
              {currentStep === 4 && (
                <QuestionsStep
                  initialData={profileData.hiringManagerQuestions}
                  onSubmit={handleQuestionsSubmit}
                  onBack={prevStep}
                />
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
