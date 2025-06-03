
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
  FileText
} from 'lucide-react';

interface MigrationWizardProps {
  onMigrationStart: () => void;
}

export const MigrationWizard: React.FC<MigrationWizardProps> = ({ onMigrationStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    sourceDb: '',
    targetDb: '',
    complexity: 'unknown',
    migrationOptions: [],
    fieldMappings: {},
    validationSettings: {}
  });

  const totalSteps = 7;
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
    "Complexity Analysis", 
    "Dry Run Simulation",
    "Migration Options",
    "Field Mapping",
    "Validation & Security",
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
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-8 w-8 text-gray-400" />
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

          {/* Step 2: Complexity Analysis */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Pre-Migration Complexity Analysis</h3>
                <p className="text-gray-400">Analyzing database structure and complexity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                      Complexity Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-400 mb-2">7.2/10</div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">High</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-green-400" />
                      Estimated Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">6.5h</div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Optimal</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                      Risk Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400 mb-2">Medium</div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Manageable</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Detailed Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white">Table Structure Compatibility</span>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">98% Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white">Data Type Mapping</span>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Manual Review Required</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white">Index & Constraint Migration</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Auto-Convertible</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white">Stored Procedures/Triggers</span>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Requires Rewrite</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Dry Run */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Dry Run Simulation</h3>
                <p className="text-gray-400">Test migration with sample data before full execution</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Sample Data Test</CardTitle>
                    <CardDescription className="text-gray-400">Testing with 1,000 sample records</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Data Transfer</span>
                        <span className="text-green-400">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Schema Conversion</span>
                        <span className="text-blue-400">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Validation Checks</span>
                        <span className="text-green-400">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Performance Projection</CardTitle>
                    <CardDescription className="text-gray-400">Based on dry run results</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Full Runtime:</span>
                      <span className="text-white font-semibold">6.5 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Transfer Rate:</span>
                      <span className="text-white font-semibold">2.3 MB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory Usage:</span>
                      <span className="text-white font-semibold">512 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Probability:</span>
                      <span className="text-green-400 font-semibold">97.8%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Dry run completed successfully. Ready for full migration.</span>
                </div>
              </div>
            </div>
          )}

          {/* Additional steps would be implemented similarly... */}
          {currentStep > 3 && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🚧</div>
              <h3 className="text-xl font-semibold text-white">Step {currentStep}: {stepTitles[currentStep - 1]}</h3>
              <p className="text-gray-400">This step is under development. Advanced configuration options will be available here.</p>
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
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === totalSteps ? (
          <Button 
            onClick={onMigrationStart}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Migration
          </Button>
        ) : (
          <Button 
            onClick={nextStep}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
