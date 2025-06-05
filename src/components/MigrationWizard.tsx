
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { DatabaseConnectionConfig } from './DatabaseConnectionConfig';
import { FieldMappingEngine } from './FieldMappingEngine';
import { ComplexityIndicator } from './ComplexityIndicator';
import { ValidationPanel } from './ValidationPanel';
import { DryRunPanel } from './DryRunPanel';
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Settings,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart,
  Clock,
  FileText,
  ArrowUpDown,
  Target,
  Loader2
} from 'lucide-react';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    sourceDb: '',
    targetDb: '',
    sourceConfig: null,
    targetConfig: null,
    fieldMappings: [],
    validationResults: null,
    dryRunResults: null,
    migrationOptions: {
      type: 'full',
      batchSize: 'medium',
      parallelProcessing: true,
      enableValidation: true,
      createBackup: true
    }
  });

  const { toast } = useToast();
  const totalSteps = 9;
  const progress = (currentStep / totalSteps) * 100;

  const databases = [
    { id: 'postgresql', name: 'PostgreSQL', type: 'SQL', icon: '🐘' },
    { id: 'mysql', name: 'MySQL', type: 'SQL', icon: '🐬' },
    { id: 'mongodb', name: 'MongoDB', type: 'NoSQL', icon: '🍃' },
    { id: 'redis', name: 'Redis', type: 'NoSQL', icon: '🔴' },
    { id: 'oracle', name: 'Oracle', type: 'SQL', icon: '🔷' },
    { id: 'cassandra', name: 'Cassandra', type: 'NoSQL', icon: '⚡' },
    { id: 'elasticsearch', name: 'Elasticsearch', type: 'NoSQL', icon: '🔍' },
    { id: 'neo4j', name: 'Neo4j', type: 'Graph', icon: '🔗' }
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    "Select Databases",
    "Source Connection", 
    "Target Connection",
    "Validation Checks",
    "Dry Run Analysis",
    "Field Mapping",
    "Migration Options",
    "Security & Validation",
    "Review & Launch"
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Wizard Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Migration Configuration Wizard</CardTitle>
              <CardDescription className="text-gray-400">
                Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
              </CardDescription>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              Professional Mode
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl min-h-[500px]">
        <CardContent className="p-8">
          
          {/* Step 1: Database Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Select Source & Target Databases</h3>
                <p className="text-gray-400">Choose your source and destination databases with auto-detection</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Source Database */}
                <div className="space-y-4">
                  <Label className="text-white text-lg flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Source Database
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {databases.map((db) => (
                      <div
                        key={`source-${db.id}`}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 database-icon ${
                          wizardData.sourceDb === db.id 
                            ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setWizardData({...wizardData, sourceDb: db.id})}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{db.icon}</div>
                          <div className="text-white font-medium">{db.name}</div>
                          <div className="text-xs text-gray-400">{db.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center lg:flex-col">
                  <ArrowRight className="h-8 w-8 text-gray-400 hidden lg:block" />
                  <ArrowUpDown className="h-8 w-8 text-gray-400 lg:hidden" />
                </div>

                {/* Target Database */}
                <div className="space-y-4">
                  <Label className="text-white text-lg flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Target Database
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {databases.map((db) => (
                      <div
                        key={`target-${db.id}`}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 database-icon ${
                          wizardData.targetDb === db.id 
                            ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/50' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => setWizardData({...wizardData, targetDb: db.id})}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{db.icon}</div>
                          <div className="text-white font-medium">{db.name}</div>
                          <div className="text-xs text-gray-400">{db.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {wizardData.sourceDb && wizardData.targetDb && (
                <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Database selection complete. Migration path validated.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Source Connection Configuration */}
          {currentStep === 2 && wizardData.sourceDb && (
            <DatabaseConnectionConfig
              databaseType={wizardData.sourceDb}
              databaseName={databases.find(db => db.id === wizardData.sourceDb)?.name || ''}
              onConnectionConfigured={(config) => {
                setWizardData({...wizardData, sourceConfig: config});
                nextStep();
              }}
              onBack={prevStep}
            />
          )}

          {/* Step 3: Target Connection Configuration */}
          {currentStep === 3 && wizardData.targetDb && (
            <DatabaseConnectionConfig
              databaseType={wizardData.targetDb}
              databaseName={databases.find(db => db.id === wizardData.targetDb)?.name || ''}
              onConnectionConfigured={(config) => {
                setWizardData({...wizardData, targetConfig: config});
                nextStep();
              }}
              onBack={prevStep}
            />
          )}

          {/* Step 4: Validation Checks */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Database Validation Checks</h3>
                <p className="text-gray-400">Verify source and target database compatibility</p>
              </div>

              <ValidationPanel 
                migrationId="wizard-validation"
                onValidationComplete={(results) => {
                  setWizardData({...wizardData, validationResults: results});
                  toast({
                    title: "Validation Complete",
                    description: "Database validation checks passed successfully.",
                    duration: 3000,
                  });
                  setTimeout(() => nextStep(), 1500);
                }}
              />
            </div>
          )}

          {/* Step 5: Dry Run Analysis */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Dry Run Analysis</h3>
                <p className="text-gray-400">Analyze migration complexity and potential issues</p>
              </div>

              <DryRunPanel
                migrationConfig={{
                  name: 'Migration Preview',
                  sourceDb: wizardData.sourceDb,
                  targetDb: wizardData.targetDb,
                  sourceConfig: wizardData.sourceConfig,
                  targetConfig: wizardData.targetConfig
                }}
                onProceedToActualMigration={() => {
                  setWizardData({...wizardData, dryRunResults: 'completed'});
                  toast({
                    title: "Dry Run Complete",
                    description: "Analysis complete. Proceeding to field mapping.",
                    duration: 3000,
                  });
                  setTimeout(() => nextStep(), 1500);
                }}
              />
            </div>
          )}

          {/* Step 6: Field Mapping */}
          {currentStep === 6 && (
            <FieldMappingEngine
              sourceSchema={[]}
              targetSchema={[]}
              onMappingComplete={(mappings) => {
                setWizardData({...wizardData, fieldMappings: mappings});
                nextStep();
              }}
            />
          )}

          {/* Step 7: Migration Options */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Migration Options & Strategy</h3>
                <p className="text-gray-400">Configure advanced migration settings and transformation rules</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Migration Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Migration Type</Label>
                      <Select defaultValue="full">
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Migration</SelectItem>
                          <SelectItem value="incremental">Incremental Migration</SelectItem>
                          <SelectItem value="selective">Selective Tables</SelectItem>
                          <SelectItem value="schema-only">Schema Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Batch Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small (1,000 records)</SelectItem>
                          <SelectItem value="medium">Medium (10,000 records)</SelectItem>
                          <SelectItem value="large">Large (100,000 records)</SelectItem>
                          <SelectItem value="custom">Custom Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="parallel" />
                        <Label htmlFor="parallel" className="text-gray-400">Enable parallel processing</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Performance Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Connection Pool Size</Label>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Timeout (seconds)</Label>
                      <Input 
                        type="number" 
                        placeholder="300" 
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="compression" />
                        <Label htmlFor="compression" className="text-white">Enable data compression</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="resume" />
                        <Label htmlFor="resume" className="text-white">Enable resume on failure</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 8: Security & Validation */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Security & Validation Configuration</h3>
                <p className="text-gray-400">Set up security protocols and final validation rules</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="ssl" defaultChecked />
                        <Label htmlFor="ssl" className="text-white">Use SSL/TLS encryption</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auth" defaultChecked />
                        <Label htmlFor="auth" className="text-white">Enable authentication</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="audit" />
                        <Label htmlFor="audit" className="text-white">Enable audit logging</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Final Validation Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="integrity" defaultChecked />
                        <Label htmlFor="integrity" className="text-white">Data integrity checks</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="foreign-keys" defaultChecked />
                        <Label htmlFor="foreign-keys" className="text-white">Foreign key validation</Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checksums" />
                        <Label htmlFor="checksums" className="text-white">Generate checksums</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 9: Review & Launch */}
          {currentStep === 9 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Migration Review & Launch</h3>
                <p className="text-gray-400">Final review of all migration settings before execution</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Migration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source Database:</span>
                        <span className="text-white">{databases.find(db => db.id === wizardData.sourceDb)?.name || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Database:</span>
                        <span className="text-white">{databases.find(db => db.id === wizardData.targetDb)?.name || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Migration Type:</span>
                        <span className="text-white">Full Migration</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Field Mappings:</span>
                        <span className="text-white">{wizardData.fieldMappings.length} configured</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Validation:</span>
                        <span className="text-green-400">✓ Passed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dry Run:</span>
                        <span className="text-green-400">✓ Completed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Readiness Check</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { check: 'Database connections', status: 'passed' },
                      { check: 'Schema compatibility', status: 'passed' },
                      { check: 'Field mappings', status: 'passed' },
                      { check: 'Security configuration', status: 'passed' },
                      { check: 'Validation checks', status: 'passed' },
                      { check: 'Dry run analysis', status: 'passed' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{item.check}</span>
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center text-green-400 mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Migration configuration complete!</span>
                </div>
                <p className="text-green-300 text-sm">All settings have been validated and the migration is ready to begin.</p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === totalSteps ? (
          <Button 
            onClick={onMigrationStart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Migration
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!wizardData.sourceDb || !wizardData.targetDb)) ||
              (currentStep === 2 && !wizardData.sourceConfig) ||
              (currentStep === 3 && !wizardData.targetConfig) ||
              (currentStep === 4 && !wizardData.validationResults) ||
              (currentStep === 5 && !wizardData.dryRunResults)
            }
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
