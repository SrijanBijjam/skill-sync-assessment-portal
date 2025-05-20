
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
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
import { HiringManagerQuestions } from '@/hooks/useProfileData';

const questionsFormSchema = z.object({
  technicalProblem: z.string().min(10, "Please provide a more detailed response"),
  continuousLearning: z.string().min(10, "Please provide a more detailed response"),
  performanceOptimization: z.string().min(10, "Please provide a more detailed response"),
});

interface QuestionsStepProps {
  initialData?: HiringManagerQuestions;
  onSubmit: (data: HiringManagerQuestions) => void;
  onBack: () => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ 
  initialData = { technicalProblem: '', continuousLearning: '', performanceOptimization: '' },
  onSubmit, 
  onBack 
}) => {
  const form = useForm<HiringManagerQuestions>({
    resolver: zodResolver(questionsFormSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: HiringManagerQuestions) => {
    onSubmit(data);
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Hiring Manager Questions
              </h2>
              <p className="text-gray-600 mb-6">
                Please answer these questions from the hiring manager to help us assess your fit for the position.
              </p>
              
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="technicalProblem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        1. Describe a challenging technical problem you've solved recently and the approach you took.
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          placeholder="Please be specific about the problem, your role, and the outcome..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="continuousLearning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        2. How do you stay updated with the latest developments in your field, and what recent technology or trend are you most excited about?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          placeholder="Share your approach to continuous learning and professional development..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="performanceOptimization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        3. What is your experience with high-performance, low-latency systems, and how do you approach optimizing code for performance?
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          rows={4}
                          placeholder="Describe your experience and methodology for performance optimization..."
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
                Submit Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuestionsStep;
