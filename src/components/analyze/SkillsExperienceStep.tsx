
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Award, FileText, Code, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SkillsExperience } from '@/hooks/useProfileData';

const skillsExperienceSchema = z.object({
  skills: z.string().min(2, "Please add at least some skills"),
  experience: z.string(),
  projects: z.string(),
  certifications: z.string(),
});

interface SkillsExperienceStepProps {
  initialData: SkillsExperience;
  onSubmit: (data: SkillsExperience) => void;
  onContinue: () => void;
  onBack: () => void;
}

const SkillsExperienceStep: React.FC<SkillsExperienceStepProps> = ({
  initialData,
  onSubmit,
  onContinue,
  onBack
}) => {
  const form = useForm<SkillsExperience>({
    resolver: zodResolver(skillsExperienceSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: SkillsExperience) => {
    onSubmit(data);
    onContinue();
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Skills & Experience</h2>
              <p className="text-gray-600 mb-6">
                We've extracted some information from your resume. Please review and edit as needed.
              </p>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Technical Skills
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your technical skills (e.g., JavaScript, Python, Project Management, etc.)"
                          className="mt-1"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Work Experience
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your most relevant work experience"
                          className="mt-1"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notable Projects
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe noteworthy projects you've worked on"
                          className="mt-1"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Certifications
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List any professional certifications you have (e.g., AWS Certified Solutions Architect, PMP, CISSP)"
                          className="mt-1"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                type="submit" 
                className="gradient-bg border-none"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SkillsExperienceStep;
