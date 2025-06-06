
import React from 'react';
import { 
  Database, 
  Wand2,
  ListChecks,
  FileJson2,
  Search,
  Rocket,
  Layers 
} from 'lucide-react';
import { useWizard } from './WizardContext';

interface StepSelectorProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export const StepSelector: React.FC<StepSelectorProps> = ({ 
  currentStep, 
  setCurrentStep, 
  totalSteps 
}) => {
  const steps = [
    { id: 1, name: 'Source DB', icon: <Database className="h-5 w-5" /> },
    { id: 2, name: 'Target DB', icon: <Database className="h-5 w-5" /> },
    { id: 3, name: 'Connectivity', icon: <Wand2 className="h-5 w-5" /> },
    { id: 4, name: 'Source Config', icon: <Layers className="h-5 w-5" /> },
    { id: 5, name: 'Target Config', icon: <Layers className="h-5 w-5" /> },
    { id: 6, name: 'Field Mapping', icon: <FileJson2 className="h-5 w-5" /> },
    { id: 7, name: 'Data Validation', icon: <ListChecks className="h-5 w-5" /> },
    { id: 8, name: 'Dry Run', icon: <Search className="h-5 w-5" /> },
    { id: 9, name: 'Review', icon: <Search className="h-5 w-5" /> },
    { id: 10, name: 'Execute', icon: <Rocket className="h-5 w-5" /> },
  ];

  return (
    <div className="hidden md:flex items-center justify-between mb-6 bg-gray-900 rounded-lg p-2">
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => step.id <= totalSteps && setCurrentStep(step.id)}
          disabled={step.id > totalSteps}
          className={`flex items-center p-2 rounded ${
            currentStep === step.id
              ? 'bg-indigo-600 text-white'
              : step.id < currentStep
              ? 'bg-gray-800 text-gray-300'
              : 'bg-gray-800 text-gray-500'
          } ${step.id <= totalSteps ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
          <div className="flex flex-col items-center">
            {step.icon}
            <span className="text-xs mt-1">{step.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
