
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <Progress value={progress} className="bg-gray-800 h-2">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </Progress>
    </div>
  );
};
