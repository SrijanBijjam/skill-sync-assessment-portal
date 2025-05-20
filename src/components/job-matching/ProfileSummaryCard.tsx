
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ProfileData } from '@/hooks/useProfileData';

interface ProfileSummaryCardProps {
  profileData: ProfileData;
  isAnalyzing: boolean;
}

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ profileData, isAnalyzing }) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <User className="mr-2 h-5 w-5" />
          Your Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-skillsync-700 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your profile...</p>
            </div>
          </div>
        ) : !profileData.profileSummary ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No profile data found.</p>
              <Button onClick={() => navigate('/analyze')} variant="default">
                Create Your Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Profile Summary</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {profileData.profileSummary}
              </p>
            </div>
            
            {profileData.skillsExperience.skills && (
              <div>
                <h3 className="font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skillsExperience.skills.split(',').map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-skillsync-100 text-skillsync-700 rounded-full text-sm">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" onClick={() => navigate('/analyze')}>
                Edit Your Profile
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSummaryCard;
