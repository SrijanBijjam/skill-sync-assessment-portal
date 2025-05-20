
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

interface PersonalInfoStepProps {
  personalInfo?: PersonalInfo;
  onContinue: () => void;
  onBack: () => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ 
  personalInfo = {}, 
  onContinue, 
  onBack 
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(personalInfo.email || '');
  const [phone, setPhone] = useState(personalInfo.phone || '');
  const [location, setLocation] = useState(personalInfo.location || '');
  const [linkedin, setLinkedin] = useState(personalInfo.linkedin || '');
  const [github, setGithub] = useState(personalInfo.github || '');

  // Handle splitting full name into first/last name
  useEffect(() => {
    if (personalInfo.name) {
      const nameParts = personalInfo.name.split(' ');
      if (nameParts.length > 0) {
        setFirstName(nameParts[0] || '');
        setLastName(nameParts.slice(1).join(' ') || '');
      }
    }
  }, [personalInfo.name]);

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p className="text-gray-600 mb-6">
              We've extracted your contact information from your resume. Please review and complete any missing details.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label 
                  htmlFor="firstName"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  First Name
                </Label>
                <Input 
                  id="firstName" 
                  className="mt-1" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  className="mt-1" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              <div>
                <Label 
                  htmlFor="email"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  className="mt-1" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <Label 
                  htmlFor="phone"
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input 
                  id="phone" 
                  className="mt-1" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label 
                  htmlFor="location"
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Location (City, State, Country)
                </Label>
                <Input 
                  id="location" 
                  className="mt-1" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
                <Input 
                  id="linkedin" 
                  className="mt-1" 
                  placeholder="https://linkedin.com/in/yourprofile" 
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="github">GitHub Profile (Optional)</Label>
                <Input 
                  id="github" 
                  className="mt-1" 
                  placeholder="https://github.com/yourusername" 
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
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

export default PersonalInfoStep;
