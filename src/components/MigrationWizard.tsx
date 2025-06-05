
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ValidationPanel } from './ValidationPanel';
import { DryRunPanel } from './DryRunPanel';
import { FieldMappingEngine } from './FieldMappingEngine';
import { ComplexityIndicator } from './ComplexityIndicator';
import { CustomTransformationBuilder } from './CustomTransformationBuilder';
import { 
  Database, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Play,
  Settings,
  Shield,
  Wand2,
  Target,
  Loader2
} from 'lucide-react';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [validationComplete, setValidationComplete] = useState(false);
  const [dryRunComplete, setDryRunComplete] = useState(false);
  const [customizationComplete, setCustomizationComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Database Configuration', description: 'Configure source and target databases', icon: Database },
    { id: 2, title: 'Field Mapping', description: 'Map and transform database fields', icon: ArrowRight },
    { id: 3, title: 'Validation Checks', description: 'Validate database connections and schema', icon: Shield },
    { id: 4, title: 'Dry Run Analysis', description: 'Analyze migration complexity and issues', icon: Target },
    { id: 5, title: 'Customization Options', description: 'Configure transformation rules', icon: Wand2 },
    { id: 6, title: 'Security Settings', description: 'Configure security and permissions', icon: Settings },
    { id: 7, title: 'Final Review', description: 'Review all settings before migration', icon: CheckCircle },
    { id: 8, title: 'Start Migration', description: 'Begin the database migration process', icon: Play }
  ];

  const handleNext = () => {
    // Enforce correct flow order
    if (currentStep === 3 && !validationComplete) {
      toast({
        title: "Validation Required",
        description: "Please complete validation checks before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 4 && !dryRunComplete) {
      toast({
        title: "Dry Run Required",
        description: "Please complete dry run analysis before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 5 && !customizationComplete) {
      toast({
        title: "Customization Required",
        description: "Please review and confirm transformation rules.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step Complete",
        description: `Moving to step ${currentStep + 1}: ${steps[currentStep].title}`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartMigration = async () => {
    setIsProcessing(true);
    
    // Simulate final checks
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Migration Started",
      description: "Database migration has begun. Check the Live Console for progress.",
    });
    
    setIsProcessing(false);
    onMigrationStart();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 3: return validationComplete;
      case 4: return dryRunComplete;
      case 5: return customizationComplete;
      default: return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Database Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your source and target database connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source Database */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Source Database</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm">Database Type</label>
                      <select className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white">
                        <option>PostgreSQL</option>
                        <option>MySQL</option>
                        <option>Oracle</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Host</label>
                      <input 
                        type="text" 
                        defaultValue="localhost"
                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Database Name</label>
                      <input 
                        type="text" 
                        defaultValue="source_db"
                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Database */}
                <div className="space-y-4">
                  <h3 className="text-white font-medium">Target Database</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-300 text-sm">Database Type</label>
                      <select className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white">
                        <option>MongoDB</option>
                        <option>PostgreSQL</option>
                        <option>MySQL</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Host</label>
                      <input 
                        type="text" 
                        defaultValue="localhost"
                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm">Database Name</label>
                      <input 
                        type="text" 
                        defaultValue="target_db"
                        className="w-full mt-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <FieldMappingEngine
            sourceSchema={[]}
            targetSchema={[]}
            onMappingComplete={() => {}}
          />
        );

      case 3:
        return (
          <ValidationPanel
            migrationId="wizard_validation"
            onValidationComplete={() => {
              setValidationComplete(true);
              toast({
                title: "✅ Validation Complete",
                description: "All validation checks passed successfully!",
              });
            }}
          />
        );

      case 4:
        return (
          <DryRunPanel
            migrationConfig={{}}
            onProceedToActualMigration={() => {
              setDryRunComplete(true);
              toast({
                title: "✅ Dry Run Complete",
                description: "Analysis complete. Ready to proceed with migration.",
              });
            }}
          />
        );

      case 5:
        return (
          <div className="space-y-6">
            <CustomTransformationBuilder
              onRulesChange={() => {
                setCustomizationComplete(true);
                toast({
                  title: "✅ Customization Complete",
                  description: "Transformation rules configured successfully.",
                });
              }}
            />
            <ComplexityIndicator score={45} showDetails={true} />
          </div>
        );

      case 6:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-400">
                Configure security options for your migration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable SSL Connection</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Encrypt Data in Transit</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Enable Audit Logging</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Backup Before Migration</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Final Review</CardTitle>
              <CardDescription className="text-gray-400">
                Review all migration settings before starting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Migration Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Source:</span>
                      <span className="text-white">PostgreSQL (localhost)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Target:</span>
                      <span className="text-white">MongoDB (localhost)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tables:</span>
                      <span className="text-white">12 tables</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Est. Records:</span>
                      <span className="text-white">~125,000</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-white font-medium">Status Checks</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Validation Complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Dry Run Complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-green-400 text-sm">Rules Configured</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Start Migration</CardTitle>
              <CardDescription className="text-gray-400">
                Ready to begin the database migration process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Play className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Migrate</h3>
                <p className="text-gray-300 mb-6">
                  All checks passed. Click the button below to start the migration process.
                </p>
                <Button
                  onClick={handleStartMigration}
                  disabled={isProcessing}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Starting Migration...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Migration Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Migration Setup Wizard</CardTitle>
              <CardDescription className="text-gray-400">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </Badge>
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLocked = step.id > currentStep && !canProceedToNext() && step.id > 2;
          
          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border text-center transition-all ${
                isActive
                  ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/30'
                  : isCompleted
                  ? 'bg-green-500/20 border-green-500/30'
                  : isLocked
                  ? 'bg-gray-500/10 border-gray-500/30 opacity-50'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-2 ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
              }`} />
              <div className={`text-xs font-medium ${
                isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'
              }`}>
                {step.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          variant="outline"
          className="border-white/20 text-gray-800 hover:bg-white/10 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < steps.length && (
          <Button
            onClick={handleNext}
            disabled={!canProceedToNext()}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
