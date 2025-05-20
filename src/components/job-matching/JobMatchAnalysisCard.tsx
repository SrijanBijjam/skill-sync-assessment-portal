
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Check, ShieldAlert } from "lucide-react";
import { JobMatchAnalysis } from '@/hooks/useProfileData';

interface JobMatchAnalysisCardProps {
  isAnalyzing: boolean;
  jobMatchAnalysis?: JobMatchAnalysis;
  onAnalyze: () => void;
  skillsAnalysis: { [key: string]: number };
}

const JobMatchAnalysisCard: React.FC<JobMatchAnalysisCardProps> = ({
  isAnalyzing,
  jobMatchAnalysis,
  onAnalyze,
  skillsAnalysis
}) => {
  return (
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
        ) : jobMatchAnalysis ? (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 bg-skillsync-100 rounded-xl">
              <h3 className="text-lg font-semibold mb-3">Overall Match Rating</h3>
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold mr-4">{jobMatchAnalysis.score}%</span>
                <Progress value={jobMatchAnalysis.score} className="h-4 flex-1" />
              </div>
              <p className="text-gray-600">{jobMatchAnalysis.summary}</p>
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
                  {jobMatchAnalysis.strengths.map((strength, index) => (
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
                  {jobMatchAnalysis.gaps.map((gap, index) => (
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
                {jobMatchAnalysis.recommendations.map((recommendation, index) => (
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
              onClick={onAnalyze}
              className="gradient-bg border-none"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze My Profile'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobMatchAnalysisCard;
