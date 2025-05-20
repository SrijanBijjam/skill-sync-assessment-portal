
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface PersonalInfoStepProps {
  onContinue: () => void;
  onBack: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ onContinue, onBack }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p className="text-gray-600 mb-6">
              Please provide your contact information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" className="mt-1" />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="location">Location (City, State, Country)</Label>
                <Input id="location" className="mt-1" />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <Input id="linkedin" className="mt-1" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="github">GitHub Profile (Optional)</Label>
                <Input id="github" className="mt-1" placeholder="https://github.com/yourusername" />
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

export default PersonalInfoStep;
