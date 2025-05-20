
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useProfileData } from '@/hooks/useProfileData';
import { generateProfileSummary, analyzeJobMatch } from '@/services/openai';

export function useJobMatchAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
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
  
  return {
    isAnalyzing,
    isAnalyzed,
    profileData,
    skillsAnalysis,
    handleAnalyze
  };
}
