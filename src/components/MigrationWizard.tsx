
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wand2 } from 'lucide-react';
import { WizardProvider } from './wizard/WizardContext';
import { ProgressTracker } from './wizard/ProgressTracker';
import { WizardFooter } from './wizard/WizardFooter';
import { SourceDBForm } from './wizard/SourceDBForm';
import { TargetDBForm } from './wizard/TargetDBForm';
import { ConnectivityPreview } from './wizard/ConnectivityPreview';
import { DatabaseConnectionWizard } from './wizard/DatabaseConnectionWizard';
import { FieldMappingConfig } from './wizard/FieldMappingConfig';
import { EnhancedDataValidationConfig } from './wizard/EnhancedDataValidationConfig';
import { EnhancedDryRunConfig } from './wizard/EnhancedDryRunConfig';
import { MigrationReviewComponent } from './wizard/MigrationReview';
import { MigrationExecutionComponent } from './wizard/MigrationExecution';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SourceDBForm />;
      case 2:
        return <TargetDBForm />;
      case 3:
        return <ConnectivityPreview />;
      case 4:
        return <DatabaseConnectionWizard type="source" />;
      case 5:
        return <DatabaseConnectionWizard type="target" />;
      case 6:
        return (
          <FieldMappingConfig
            sourceFields={['id', 'name', 'email', 'created_at', 'status', 'user_type', 'preferences']}
            targetFields={['_id', 'fullName', 'emailAddress', 'creationDate', 'userStatus', 'role', 'settings']}
          />
        );
      case 7:
        return (
          <EnhancedDataValidationConfig
            fields={['id', 'name', 'email', 'created_at', 'status', 'user_type', 'preferences']}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 8:
        return (
          <EnhancedDryRunConfig
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 9:
        return <MigrationReviewComponent />;
      case 10:
        return <MigrationExecutionComponent />;
      default:
        return null;
    }
  };

  return (
    <WizardProvider>
      <Card className="bg-gray-900 border-gray-700 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl flex items-center">
              <Wand2 className="h-6 w-6 mr-3 text-indigo-400" />
              Database Migration Wizard
            </CardTitle>
          </div>
        </CardHeader>
        <Separator className="bg-gray-800" />
        <CardContent className="p-6">
          <ProgressTracker currentStep={currentStep} totalSteps={totalSteps} />
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
            {renderStep()}
          </div>
          <div className="mt-6">
            <WizardFooter 
              currentStep={currentStep}
              totalSteps={totalSteps}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>
        </CardContent>
      </Card>
    </WizardProvider>
  );
};
