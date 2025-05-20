
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfileSummaryCard from '@/components/job-matching/ProfileSummaryCard';
import JobDescriptionCard from '@/components/job-matching/JobDescriptionCard';
import JobMatchAnalysisCard from '@/components/job-matching/JobMatchAnalysisCard';
import { useJobMatchAnalysis } from '@/components/job-matching/useJobMatchAnalysis';

const JobMatching: React.FC = () => {
  const {
    isAnalyzing,
    profileData,
    skillsAnalysis,
    handleAnalyze
  } = useJobMatchAnalysis();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container-custom">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Job Matching Analysis</h1>
            <p className="text-lg text-gray-600">
              Comparing your professional profile with the job position
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Candidate Profile Summary */}
            <div className="lg:col-span-4">
              <ProfileSummaryCard
                profileData={profileData}
                isAnalyzing={isAnalyzing}
              />
            </div>
            
            {/* Right Column: Job Description & Matching Results */}
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {/* Complete Job Description Card */}
                <JobDescriptionCard />
              
                {/* Analysis Card */}
                <JobMatchAnalysisCard
                  isAnalyzing={isAnalyzing}
                  jobMatchAnalysis={profileData.jobMatchAnalysis}
                  onAnalyze={handleAnalyze}
                  skillsAnalysis={skillsAnalysis}
                />
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
