
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wand2 } from 'lucide-react';
import { WizardProvider } from './wizard/WizardContext';
import { ProgressTracker } from './wizard/ProgressTracker';
import { SourceDBForm } from './wizard/SourceDBForm';
import { TargetDBForm } from './wizard/TargetDBForm';
import { ConnectivityPreview } from './wizard/ConnectivityPreview';
import { WizardFooter } from './wizard/WizardFooter';
import { DatabaseConnectionConfig } from './DatabaseConnectionConfig';
import { FieldMappingConfig } from './FieldMappingConfig';
import { EnhancedDataValidationConfig } from './wizard/EnhancedDataValidationConfig';
import { EnhancedDryRunConfig } from './wizard/EnhancedDryRunConfig';
import { MigrationReview } from './MigrationReview';
import { MigrationExecution } from './MigrationExecution';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

// Main component that provides the context
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
        return (
          <DatabaseConnectionConfig
            databaseType="source"
            databaseName="Source Database"
            onConnectionConfigured={(config) => handleNext()}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <DatabaseConnectionConfig
            databaseType="target"
            databaseName="Target Database"
            onConnectionConfigured={(config) => handleNext()}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <FieldMappingConfig
            sourceFields={['field1', 'field2', 'field3']}
            targetFields={['fieldA', 'fieldB', 'fieldC']}
            onFieldMappingsChange={() => {}}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 7:
        return (
          <EnhancedDataValidationConfig
            fields={['fieldA', 'fieldB', 'fieldC']}
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
        return (
          <MigrationReview
            migrationState={{
              sourceConfig: { type: '', host: '', port: 0, database: '' },
              targetConfig: { type: '', host: '', port: 0, database: '' },
              fieldMappings: [],
              validationRules: [],
              dryRunOptions: { batchSize: 1000, enableValidation: true },
              migrationOptions: { truncateTarget: false }
            }}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 10:
        return (
          <MigrationExecution
            migrationState={{
              sourceConfig: { type: '', host: '', port: 0, database: '' },
              targetConfig: { type: '', host: '', port: 0, database: '' },
              fieldMappings: [],
              validationRules: [],
              dryRunOptions: { batchSize: 1000, enableValidation: true },
              migrationOptions: { truncateTarget: false }
            }}
            onMigrationStart={onMigrationStart}
          />
        );
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
