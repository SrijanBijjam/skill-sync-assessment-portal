
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Award, FileText, Code, Briefcase } from "lucide-react";

interface SkillsExperienceStepProps {
  skillsField: string;
  experienceField: string;
  projectsField?: string;
  certificationsField?: string;
  onSkillsChange: (skills: string) => void;
  onExperienceChange: (experience: string) => void;
  onProjectsChange?: (projects: string) => void;
  onCertificationsChange?: (certifications: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const SkillsExperienceStep: React.FC<SkillsExperienceStepProps> = ({
  skillsField,
  experienceField,
  projectsField = '',
  certificationsField = '',
  onSkillsChange,
  onExperienceChange,
  onProjectsChange = () => {},
  onCertificationsChange = () => {},
  onContinue,
  onBack
}) => {
  return (
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
                <Label 
                  htmlFor="skills" 
                  className="flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Technical Skills
                </Label>
                <Textarea 
                  id="skills" 
                  placeholder="List your technical skills (e.g., JavaScript, Python, Project Management, etc.)"
                  className="mt-1"
                  rows={4}
                  value={skillsField}
                  onChange={(e) => onSkillsChange(e.target.value)}
                />
              </div>
              
              <div>
                <Label 
                  htmlFor="experience" 
                  className="flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Work Experience
                </Label>
                <Textarea 
                  id="experience" 
                  placeholder="Briefly describe your most relevant work experience"
                  className="mt-1"
                  rows={4}
                  value={experienceField}
                  onChange={(e) => onExperienceChange(e.target.value)}
                />
              </div>
              
              <div>
                <Label 
                  htmlFor="projects"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Notable Projects
                </Label>
                <Textarea 
                  id="projects" 
                  placeholder="Describe noteworthy projects you've worked on"
                  className="mt-1"
                  rows={4}
                  value={projectsField}
                  onChange={(e) => onProjectsChange(e.target.value)}
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
                  value={certificationsField}
                  onChange={(e) => onCertificationsChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
            <Button 
              type="button" 
              className="gradient-bg border-none"
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsExperienceStep;
