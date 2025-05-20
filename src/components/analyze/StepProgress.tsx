
import React from 'react';

interface StepProgressProps {
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center">
        <div className="flex-1 relative">
          <div className={`w-10 h-10 rounded-full ${currentStep >= 1 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
            1
          </div>
          <div className="text-center mt-2 text-sm">Resume</div>
          <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
            <div className={`h-full ${currentStep >= 2 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className={`w-10 h-10 rounded-full ${currentStep >= 2 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
            2
          </div>
          <div className="text-center mt-2 text-sm">Skills</div>
          <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
            <div className={`h-full ${currentStep >= 3 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <div className={`w-10 h-10 rounded-full ${currentStep >= 3 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
            3
          </div>
          <div className="text-center mt-2 text-sm">Personal Info</div>
          <div className="absolute w-full h-1 top-5 left-1/2 -z-10 bg-gray-200">
            <div className={`h-full ${currentStep >= 4 ? 'gradient-bg' : 'bg-gray-200'}`} style={{width: '100%'}}></div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className={`w-10 h-10 rounded-full ${currentStep >= 4 ? 'gradient-bg' : 'bg-gray-200'} flex items-center justify-center text-white font-medium mx-auto`}>
            4
          </div>
          <div className="text-center mt-2 text-sm">Questions</div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
