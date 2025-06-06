
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
}

export const WizardFooter: React.FC<WizardFooterProps> = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext 
}) => {
  return (
    <div className="flex justify-between pt-6">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
        className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Button
        onClick={onNext}
        disabled={currentStep === totalSteps}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
      >
        {currentStep === totalSteps - 1 ? (
          <>
            Review Migration <CheckCircle className="h-4 w-4 ml-2" />
          </>
        ) : (
          <>
            Next Step <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
