import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { parseResume } from '@/lib/resume-parser';
import { parseResumeWithExternalApi, isResumeParserApiConfigured } from '@/services/resumeParserApi';
import { useProfileData } from '@/hooks/useProfileData';
import { useNavigate } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";

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
  const [useExternalParser, setUseExternalParser] = useState(false); // Default to local parser
  const [isExternalParserAvailable, setIsExternalParserAvailable] = useState(false);
  const [parsingStatus, setParsingStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { clearAllData } = useProfileData();
  const navigate = useNavigate();
  
  // Check if the external parser is available
  useEffect(() => {
    const apiConfigured = isResumeParserApiConfigured();
    setIsExternalParserAvailable(apiConfigured);
    
    if (apiConfigured) {
      console.log('Resume Parser API is configured and available');
      setUseExternalParser(true); // If API is available, default to using it
    } else {
      console.log('Resume Parser API is not configured. Using local parser instead.');
    }
  }, []);
  
  const processResumeFile = async (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        onResumeStatusChange(false, file.name);
        
        if (useExternalParser && isExternalParserAvailable) {
          toast.info("Parsing resume with enhanced API...");
          setParsingStatus('Uploading resume to parsing service...');
        } else {
          toast.info("Parsing resume locally...");
          setParsingStatus('Extracting text from PDF...');
        }
        
        let parsedData;
        
        if (useExternalParser && isExternalParserAvailable) {
          // Use the external Resume Parser API
          setParsingStatus('Sending file to external parser service...');
          parsedData = await parseResumeWithExternalApi(file);
          setParsingStatus('Processing parser results...');
        } else {
          // Use the local PDF.js parser
          setParsingStatus('Extracting text from PDF...');
          parsedData = await parseResume(file);
          setParsingStatus('Analyzing resume sections...');
        }
        
        onResumeProcessed(
          parsedData.fullText,
          parsedData.skills,
          parsedData.experience,
          parsedData.projects,
          parsedData.personalInfo
        );
        
        setParsingStatus('');
        onResumeStatusChange(true, file.name);
        
        if (useExternalParser && isExternalParserAvailable) {
          toast.success("Resume parsed successfully with enhanced API");
        } else {
          toast.success("Resume parsed successfully");
        }
      } catch (error) {
        console.error("Error parsing resume:", error);
        setParsingStatus('');
        
        // If external parser failed, try falling back to local parser
        if (useExternalParser && isExternalParserAvailable) {
          toast.error("Failed to parse resume with external API. Trying local parser instead...");
          setUseExternalParser(false);
          await processResumeFile(file); // Try again with local parser
          return;
        }
        
        toast.error("Failed to parse resume. Please try again with a different file.");
        onResumeStatusChange(false, '');
      }
    } else if (file.name.endsWith('.docx')) {
      toast.error("DOCX files are not yet supported. Please upload a PDF.");
    } else {
      toast.error("Unsupported file format. Please upload a PDF file.");
    }
  };
  
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleBrowseClick = () => {
    inputRef.current?.click();
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
            
            {/* Parser Selection Toggle - Always show in development for testing */}
            {!resumeUploaded && (
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-md">
                <div>
                  <Label htmlFor="parser-toggle" className="text-sm font-medium">
                    Use Enhanced Resume Parser {isExternalParserAvailable ? '✓' : '✗'}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {isExternalParserAvailable 
                      ? "Our enhanced parser provides better extraction results for various resume formats"
                      : "Enhanced parser is not configured. Using local parser instead."}
                  </p>
                </div>
                <Switch
                  id="parser-toggle"
                  checked={useExternalParser}
                  onCheckedChange={setUseExternalParser}
                  disabled={isParsingResume || !isExternalParserAvailable}
                />
              </div>
            )}
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-skillsync-300 bg-skillsync-50' : 'border-gray-300'}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={isParsingResume || resumeUploaded ? undefined : handleBrowseClick}
              style={{ cursor: isParsingResume ? 'wait' : resumeUploaded ? 'default' : 'pointer' }}
            >
              {isParsingResume ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-skillsync-300 animate-spin mb-4" />
                  <p className="text-lg font-medium">Parsing resume...</p>
                  <p className="text-gray-500 mb-4">{parsingStatus || 'This may take a few moments'}</p>
                  <p className="text-xs text-gray-400">
                    Using {useExternalParser && isExternalParserAvailable ? 'enhanced API parser' : 'local PDF parser'}
                  </p>
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
                  <Label htmlFor="resume">
                    <Button type="button" variant="outline" className="cursor-pointer" onClick={handleBrowseClick}>
                      Browse Files
                    </Button>
                  </Label>
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
