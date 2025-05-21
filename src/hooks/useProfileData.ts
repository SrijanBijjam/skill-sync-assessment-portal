import { useState, useEffect } from 'react';
import { z } from 'zod';

// Define all the profile data types
export interface PersonalInfo {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

export interface SkillsExperience {
  skills: string;
  experience: string;
  projects: string;
  certifications: string;
}

export interface HiringManagerQuestions {
  technicalProblem: string;
  continuousLearning: string;
  performanceOptimization: string;
}

export interface JobMatchAnalysis {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  skillsAnalysis?: { [key: string]: number };
  summary?: string;
}

export interface ProfileData {
  resumeUploaded: boolean;
  resumeFileName: string;
  resumeText: string;
  skillsExperience: SkillsExperience;
  personalInfo: PersonalInfo;
  hiringManagerQuestions: HiringManagerQuestions;
  profileSummary?: string;
  jobMatchAnalysis?: JobMatchAnalysis;
  lastUpdated: number; // timestamp
}

// Initial empty state
const initialProfileData: ProfileData = {
  resumeUploaded: false,
  resumeFileName: '',
  resumeText: '',
  skillsExperience: {
    skills: '',
    experience: '',
    projects: '',
    certifications: '',
  },
  personalInfo: {},
  hiringManagerQuestions: {
    technicalProblem: '',
    continuousLearning: '',
    performanceOptimization: '',
  },
  lastUpdated: Date.now(),
};

// Key for localStorage
const PROFILE_DATA_KEY = 'skillsync_profile_data';

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on initial mount
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const savedData = localStorage.getItem(PROFILE_DATA_KEY);
        if (savedData) {
          setProfileData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(PROFILE_DATA_KEY, JSON.stringify({
          ...profileData,
          lastUpdated: Date.now()
        }));
      } catch (error) {
        console.error('Error saving profile data to localStorage:', error);
      }
    }
  }, [profileData, isLoading]);

  // Update methods for each section
  const updateResumeData = (data: Partial<Pick<ProfileData, 'resumeUploaded' | 'resumeFileName' | 'resumeText'>>) => {
    setProfileData(prev => ({
      ...prev,
      ...data
    }));
  };

  const updateSkillsExperience = (data: Partial<SkillsExperience>) => {
    setProfileData(prev => ({
      ...prev,
      skillsExperience: {
        ...prev.skillsExperience,
        ...data
      }
    }));
  };

  const updatePersonalInfo = (data: Partial<PersonalInfo>) => {
    setProfileData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...data
      }
    }));
  };

  const updateHiringManagerQuestions = (data: Partial<HiringManagerQuestions>) => {
    setProfileData(prev => ({
      ...prev,
      hiringManagerQuestions: {
        ...prev.hiringManagerQuestions,
        ...data
      }
    }));
  };

  const updateProfileSummary = (summary: string) => {
    setProfileData(prev => ({
      ...prev,
      profileSummary: summary
    }));
  };

  const updateJobMatchAnalysis = (analysis: JobMatchAnalysis) => {
    setProfileData(prev => ({
      ...prev,
      jobMatchAnalysis: analysis
    }));
  };

  const resetProfileData = () => {
    setProfileData(initialProfileData);
    localStorage.removeItem(PROFILE_DATA_KEY);
  };

  // Add a function to completely clear localStorage
  const clearAllData = () => {
    localStorage.clear();
    setProfileData(initialProfileData);
  };

  return {
    profileData,
    isLoading,
    updateResumeData,
    updateSkillsExperience,
    updatePersonalInfo,
    updateHiringManagerQuestions,
    updateProfileSummary,
    updateJobMatchAnalysis,
    resetProfileData,
    clearAllData
  };
}
