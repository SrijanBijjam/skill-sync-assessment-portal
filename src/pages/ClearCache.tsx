import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useProfileData } from '@/hooks/useProfileData';
import { toast } from "@/components/ui/sonner";

const ClearCache: React.FC = () => {
  const navigate = useNavigate();
  const { clearAllData } = useProfileData();

  const handleClearCache = () => {
    try {
      clearAllData();
      toast.success("Cache cleared successfully", {
        description: "All stored data has been removed."
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast.error("Failed to clear cache", {
        description: "Please try again or contact support."
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[450px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-red-500" />
            Clear Application Cache
          </CardTitle>
          <CardDescription>
            This will reset all stored data including profile information, resume analysis, and job matching results.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Use this option if you're experiencing issues with the application or want to start fresh. 
            All your data will be deleted from your browser's storage.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
            <strong>Warning:</strong> This action cannot be undone. All your saved profile data will be permanently deleted.
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleClearCache}>
            Clear All Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClearCache;
