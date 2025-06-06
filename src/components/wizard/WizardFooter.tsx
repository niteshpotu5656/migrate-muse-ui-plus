
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useWizard } from './WizardContext';

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
  const { state } = useWizard();
  
  // Determine if next button should be disabled
  const isNextDisabled = () => {
    // If on validation step (step 7), next is disabled until validation passes
    if (currentStep === 7) {
      return !state.validationPassed;
    }
    
    // If on dry run step (step 8), next is disabled until dry run passes
    if (currentStep === 8) {
      return !state.dryRunPassed;
    }
    
    // Default: only disable at last step
    return currentStep === totalSteps;
  };
  
  // Get tooltip message for disabled next button
  const getTooltipMessage = () => {
    if (currentStep === 7 && !state.validationPassed) {
      return "Complete validation before proceeding";
    }
    
    if (currentStep === 8 && !state.dryRunPassed) {
      return "Complete dry run before proceeding";
    }
    
    return "";
  };
  
  const nextButtonContent = () => {
    if (currentStep === totalSteps - 1) {
      return (
        <>
          Review Migration <CheckCircle className="h-4 w-4 ml-2" />
        </>
      );
    }
    
    if (currentStep === totalSteps - 2) {
      return (
        <>
          Proceed to Migration <ArrowRight className="h-4 w-4 ml-2" />
        </>
      );
    }
    
    return (
      <>
        Next Step <ArrowRight className="h-4 w-4 ml-2" />
      </>
    );
  };

  const renderNextButton = () => {
    const disabled = isNextDisabled();
    const tooltipMessage = getTooltipMessage();
    
    const nextButton = (
      <Button
        onClick={onNext}
        disabled={disabled}
        className={`${disabled 
          ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed' 
          : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
        } text-white`}
      >
        {nextButtonContent()}
      </Button>
    );
    
    if (disabled && tooltipMessage) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {nextButton}
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 text-white border-gray-700">
              <p>{tooltipMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return nextButton;
  };

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
      
      {renderNextButton()}
    </div>
  );
};
