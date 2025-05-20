
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import our new components
import StepProgress from '@/components/analyze/StepProgress';
import ResumeUploadStep from '@/components/analyze/ResumeUploadStep';
import SkillsExperienceStep from '@/components/analyze/SkillsExperienceStep';
import PersonalInfoStep from '@/components/analyze/PersonalInfoStep';
import QuestionsStep from '@/components/analyze/QuestionsStep';

const Analyze = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [skillsField, setSkillsField] = useState('');
  const [experienceField, setExperienceField] = useState('');
  
  const handleResumeStatusChange = (isUploaded: boolean, fileName: string) => {
    setResumeUploaded(isUploaded);
    setResumeFileName(fileName);
    setIsParsingResume(!isUploaded && fileName !== '');
  };
  
  const handleResumeProcessed = (text: string, skills: string, experience: string) => {
    setResumeText(text);
    setSkillsField(skills);
    setExperienceField(experience);
    setIsParsingResume(false);
  };
  
  const nextStep = () => {
    setCurrentStep(current => current + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setCurrentStep(current => current - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = () => {
    navigate('/job-matching');
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
            <StepProgress currentStep={currentStep} />
            
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              {/* Step 1: Resume Upload */}
              {currentStep === 1 && (
                <ResumeUploadStep
                  resumeUploaded={resumeUploaded}
                  resumeFileName={resumeFileName}
                  isParsingResume={isParsingResume}
                  onResumeProcessed={handleResumeProcessed}
                  onResumeStatusChange={handleResumeStatusChange}
                  onContinue={nextStep}
                />
              )}
              
              {/* Step 2: Skills & Experience */}
              {currentStep === 2 && (
                <SkillsExperienceStep
                  skillsField={skillsField}
                  experienceField={experienceField}
                  onSkillsChange={setSkillsField}
                  onExperienceChange={setExperienceField}
                  onContinue={nextStep}
                  onBack={prevStep}
                />
              )}
              
              {/* Step 3: Personal Information */}
              {currentStep === 3 && (
                <PersonalInfoStep
                  onContinue={nextStep}
                  onBack={prevStep}
                />
              )}
              
              {/* Step 4: Questions */}
              {currentStep === 4 && (
                <QuestionsStep
                  onSubmit={handleSubmit}
                  onBack={prevStep}
                />
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
