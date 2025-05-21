import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { parseResume } from '@/lib/resume-parser';
import { useProfileData } from '@/hooks/useProfileData';
import { useNavigate } from 'react-router-dom';

interface ResumeUploadStepProps {
  resumeUploaded: boolean;
  resumeFileName: string;
  isParsingResume: boolean;
  onResumeProcessed: (text: string, skills: string, experience: string, projects: string, personalInfo: any) => void;
  onResumeStatusChange: (isUploaded: boolean, fileName: string) => void;
  onContinue: () => void;
}

const ResumeUploadStep: React.FC<ResumeUploadStepProps> = ({
  resumeUploaded,
  resumeFileName,
  isParsingResume,
  onResumeProcessed,
  onResumeStatusChange,
  onContinue
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { clearAllData } = useProfileData();
  const navigate = useNavigate();
  
  const processResumeFile = async (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        onResumeStatusChange(false, file.name);
        toast.info("Parsing resume...");
        
        const parsedData = await parseResume(file);
        
        onResumeProcessed(
          parsedData.fullText,
          parsedData.skills,
          parsedData.experience,
          parsedData.projects,
          parsedData.personalInfo
        );
        
        onResumeStatusChange(true, file.name);
        toast.success("Resume parsed successfully");
      } catch (error) {
        console.error("Error parsing resume:", error);
        toast.error("Failed to parse resume. Please try again.");
        onResumeStatusChange(false, '');
      }
    } else if (file.name.endsWith('.docx')) {
      toast.error("DOCX files are not yet supported. Please upload a PDF.");
    } else {
      toast.error("Unsupported file format. Please upload a PDF file.");
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input change detected", e.target.files);
    if (e.target.files && e.target.files[0]) {
      await processResumeFile(e.target.files[0]);
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processResumeFile(file);
    }
  };

  const handleBrowseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
      // Reset the input value to ensure onChange triggers even if selecting the same file
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };
  
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
            <p className="text-gray-600 mb-6">
              Upload your resume to help us analyze your skills and experience. Currently supporting PDF files only.
            </p>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-skillsync-300 bg-skillsync-50' : 'border-gray-300'}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={isParsingResume || resumeUploaded ? undefined : () => {
                if (inputRef.current) {
                  inputRef.current.value = '';
                  inputRef.current.click();
                }
              }}
              style={{ cursor: isParsingResume ? 'wait' : resumeUploaded ? 'default' : 'pointer' }}
            >
              {isParsingResume ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-skillsync-300 animate-spin mb-4" />
                  <p className="text-lg font-medium">Parsing resume...</p>
                  <p className="text-gray-500 mb-4">This may take a few moments</p>
                </div>
              ) : !resumeUploaded ? (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop your resume here, or click to browse</p>
                  <Input
                    type="file"
                    id="resume"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    ref={inputRef}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="cursor-pointer" 
                    onClick={handleBrowseClick}
                  >
                    Browse Files
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">{resumeFileName}</p>
                  <p className="text-gray-500 mb-4">Successfully uploaded</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clearAllData();
                      toast.success("Profile data cleared", {
                        description: "Previous analysis data has been reset."
                      });
                      navigate('/');
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              className="gradient-bg border-none"
              onClick={onContinue}
              disabled={!resumeUploaded || isParsingResume}
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploadStep;
