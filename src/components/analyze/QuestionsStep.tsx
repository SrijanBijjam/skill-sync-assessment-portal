
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface QuestionsStepProps {
  onSubmit: () => void;
  onBack: () => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ onSubmit, onBack }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Hiring Manager Questions
            </h2>
            <p className="text-gray-600 mb-6">
              Please answer these questions from the hiring manager to help us assess your fit for the position.
            </p>
            
            <div className="space-y-5">
              <div>
                <Label htmlFor="question1" className="font-medium">
                  1. Describe a challenging technical problem you've solved recently and the approach you took.
                </Label>
                <Textarea 
                  id="question1" 
                  className="mt-2"
                  rows={4}
                  placeholder="Please be specific about the problem, your role, and the outcome..."
                />
              </div>
              
              <div>
                <Label htmlFor="question2" className="font-medium">
                  2. How do you stay updated with the latest developments in your field, and what recent technology or trend are you most excited about?
                </Label>
                <Textarea 
                  id="question2" 
                  className="mt-2"
                  rows={4}
                  placeholder="Share your approach to continuous learning and professional development..."
                />
              </div>
              
              <div>
                <Label htmlFor="question3" className="font-medium">
                  3. What is your experience with high-performance, low-latency systems, and how do you approach optimizing code for performance?
                </Label>
                <Textarea 
                  id="question3" 
                  className="mt-2"
                  rows={4}
                  placeholder="Describe your experience and methodology for performance optimization..."
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
              type="submit" 
              className="gradient-bg border-none"
              onClick={onSubmit}
            >
              Submit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionsStep;
