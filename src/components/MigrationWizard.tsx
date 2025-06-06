import React, { useState, createContext, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { DatabaseConnectionConfig } from "@/components/DatabaseConnectionConfig";
import { FieldMappingConfig } from "@/components/FieldMappingConfig";
import { DataValidationConfig } from "@/components/DataValidationConfig";
import { DryRunConfig } from "@/components/DryRunConfig";
import { MigrationReview } from "@/components/MigrationReview";
import { MigrationExecution } from "@/components/MigrationExecution";
import {
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Wand2,
  ListChecks,
  Play,
  FileJson2,
  Search,
  Rocket,
  Layers
} from 'lucide-react';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

interface MigrationState {
  sourceConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
  };
  targetConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
  };
  fieldMappings: {
    sourceField: string;
    targetField: string;
  }[];
  validationRules: {
    field: string;
    rule: string;
  }[];
  dryRunOptions: {
    batchSize: number;
    enableValidation: boolean;
  };
  migrationOptions: {
    truncateTarget: boolean;
  };
}

const defaultMigrationState: MigrationState = {
  sourceConfig: {
    type: '',
    host: 'localhost',
    port: 0,
    database: ''
  },
  targetConfig: {
    type: '',
    host: 'localhost',
    port: 0,
    database: ''
  },
  fieldMappings: [],
  validationRules: [],
  dryRunOptions: {
    batchSize: 1000,
    enableValidation: true
  },
  migrationOptions: {
    truncateTarget: false
  }
};

interface WizardContextProps {
  state: MigrationState;
  updateState: (newState: Partial<MigrationState>) => void;
}

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};

interface WizardProviderProps {
  children: React.ReactNode;
}

const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [state, setState] = useState<MigrationState>(defaultMigrationState);

  const updateState = (newState: Partial<MigrationState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <WizardContext.Provider value={{ state, updateState }}>
      {children}
    </WizardContext.Provider>
  );
};

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { state, updateState } = useWizard();

  const totalSteps = 9;
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="text-white">Select Source Database</CardTitle>
              <CardDescription className="text-gray-400">Choose the type of your source database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Database Type</Label>
                  <Select onValueChange={(value) => updateState({ sourceConfig: { ...state.sourceConfig, type: value } })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="redis">Redis</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="cassandra">Cassandra</SelectItem>
                      <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                      <SelectItem value="neo4j">Neo4j</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="text-white">Select Target Database</CardTitle>
              <CardDescription className="text-gray-400">Choose the type of your target database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Database Type</Label>
                  <Select onValueChange={(value) => updateState({ targetConfig: { ...state.targetConfig, type: value } })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="mongodb">MongoDB</SelectItem>
                      <SelectItem value="redis">Redis</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="cassandra">Cassandra</SelectItem>
                      <SelectItem value="elasticsearch">Elasticsearch</SelectItem>
                      <SelectItem value="neo4j">Neo4j</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </div>
        );

      case 3:
        return (
          <DatabaseConnectionConfig
            databaseType={state.sourceConfig.type || 'postgresql'}
            databaseName={getDatabaseDisplayName(state.sourceConfig.type || 'postgresql')}
            onConnectionConfigured={(config) => {
              updateState({
                sourceConfig: { ...state.sourceConfig, ...config }
              });
              setCurrentStep(4);
            }}
            onBack={() => setCurrentStep(2)}
          />
        );

      case 4:
        return (
          <DatabaseConnectionConfig
            databaseType={state.targetConfig.type || 'mongodb'}
            databaseName={getDatabaseDisplayName(state.targetConfig.type || 'mongodb')}
            onConnectionConfigured={(config) => {
              updateState({
                targetConfig: { ...state.targetConfig, ...config }
              });
              setCurrentStep(5);
            }}
            onBack={() => setCurrentStep(3)}
          />
        );

      case 5:
        return (
          <div className="space-y-6">
            <FieldMappingConfig
              sourceFields={['field1', 'field2', 'field3']}
              targetFields={['fieldA', 'fieldB', 'fieldC']}
              onFieldMappingsChange={(mappings) => {
                updateState({ fieldMappings: mappings });
              }}
              onBack={() => setCurrentStep(4)}
              onNext={() => setCurrentStep(6)}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <DataValidationConfig
              fields={['fieldA', 'fieldB', 'fieldC']}
              onValidationRulesChange={(rules) => {
                updateState({ validationRules: rules });
              }}
              onBack={() => setCurrentStep(5)}
              onNext={() => setCurrentStep(7)}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <DryRunConfig
              onDryRunOptionsChange={(options) => {
                updateState({ dryRunOptions: options });
              }}
              onBack={() => setCurrentStep(6)}
              onNext={() => setCurrentStep(8)}
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <MigrationReview
              migrationState={state}
              onBack={() => setCurrentStep(7)}
              onNext={() => setCurrentStep(9)}
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <MigrationExecution
              migrationState={state}
              onMigrationStart={onMigrationStart}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Helper function to get display name for database types
  const getDatabaseDisplayName = (type: string): string => {
    const displayNames: Record<string, string> = {
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
      redis: 'Redis',
      oracle: 'Oracle',
      cassandra: 'Cassandra',
      elasticsearch: 'Elasticsearch',
      neo4j: 'Neo4j'
    };
    return displayNames[type] || type;
  };

  return (
    <WizardProvider>
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl flex items-center">
              <Wand2 className="h-6 w-6 mr-3" />
              Migration Wizard
            </CardTitle>
          </div>
          <CardDescription className="text-gray-400">
            Step {currentStep} of {totalSteps}
          </CardDescription>
        </CardHeader>
        <Separator className="bg-white/20" />
        <CardContent className="space-y-6">
          <Progress value={progress} className="bg-white/10" />
          {renderStep()}
        </CardContent>
        <Separator className="bg-white/20" />
        <div className="flex justify-between p-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
          >
            {currentStep === totalSteps -1 ? (
              <>
                Review Migration <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next Step <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </WizardProvider>
  );
};
