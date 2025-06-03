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
  Lock,
  Key,
  Globe,
  ArrowUpDown,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload
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
    validationSettings: {},
    securitySettings: {},
    finalReview: {}
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

          {/* Step 4: Migration Options */}
          {currentStep === 4 && (
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
                      <Label className="text-white">Parallel Processing</Label>
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

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Data Transformation Rules</CardTitle>
                  <CardDescription className="text-gray-400">Configure custom transformation logic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Custom SQL Transformations</Label>
                    <Textarea 
                      placeholder="-- Add custom SQL transformation rules here
CASE 
  WHEN status = 'active' THEN 1 
  WHEN status = 'inactive' THEN 0 
  ELSE NULL 
END"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="nulls" />
                        <Label htmlFor="nulls" className="text-white">Handle NULL values</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="duplicates" />
                        <Label htmlFor="duplicates" className="text-white">Remove duplicates</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Field Mapping */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Field Mapping</h3>
                <p className="text-gray-400">Map source fields to target schema with custom transformations</p>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowUpDown className="h-5 w-5 mr-2" />
                    Table: users
                  </CardTitle>
                  <CardDescription className="text-gray-400">Source → Target field mappings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { source: 'id', target: 'user_id', type: 'INTEGER → UUID', status: 'auto' },
                    { source: 'username', target: 'user_name', type: 'VARCHAR → TEXT', status: 'mapped' },
                    { source: 'email', target: 'email_address', type: 'VARCHAR → TEXT', status: 'mapped' },
                    { source: 'created_at', target: 'created_timestamp', type: 'DATETIME → TIMESTAMP', status: 'transform' },
                    { source: 'status', target: 'is_active', type: 'ENUM → BOOLEAN', status: 'custom' }
                  ].map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-1">
                          <div className="text-white font-medium">{field.source}</div>
                          <div className="text-sm text-gray-400">{field.type.split(' → ')[0]}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-white font-medium">{field.target}</div>
                          <div className="text-sm text-gray-400">{field.type.split(' → ')[1]}</div>
                        </div>
                      </div>
                      <Badge className={`
                        ${field.status === 'auto' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                        ${field.status === 'mapped' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                        ${field.status === 'transform' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : ''}
                        ${field.status === 'custom' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : ''}
                      `}>
                        {field.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Custom Transformation</CardTitle>
                    <CardDescription className="text-gray-400">status → is_active mapping</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Transformation Rule</Label>
                      <Textarea 
                        defaultValue="CASE 
  WHEN status = 'active' THEN true 
  WHEN status = 'inactive' THEN false 
  ELSE NULL 
END"
                        className="bg-white/10 border-white/20 text-white font-mono text-sm"
                      />
                    </div>
                    <Button size="sm" className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Transformation
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Mapping Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Fields:</span>
                      <span className="text-white">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto-mapped:</span>
                      <span className="text-green-400">39</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Custom mappings:</span>
                      <span className="text-blue-400">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Requires attention:</span>
                      <span className="text-orange-400">2</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="text-center text-sm text-gray-400">85% mapping complete</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 6: Validation & Security */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Validation & Security Configuration</h3>
                <p className="text-gray-400">Set up data validation rules and security protocols</p>
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

                    <div className="space-y-2">
                      <Label className="text-white">Encryption Key</Label>
                      <div className="flex space-x-2">
                        <Input 
                          type="password" 
                          placeholder="Enter encryption key"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        />
                        <Button size="icon" variant="outline" className="border-white/20">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Validation Rules
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

                    <div className="space-y-2">
                      <Label className="text-white">Validation Threshold</Label>
                      <Select defaultValue="strict">
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lenient">Lenient (warnings only)</SelectItem>
                          <SelectItem value="moderate">Moderate (some errors allowed)</SelectItem>
                          <SelectItem value="strict">Strict (zero tolerance)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Backup & Recovery</CardTitle>
                  <CardDescription className="text-gray-400">Configure backup strategy before migration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="backup-source" defaultChecked />
                        <Label htmlFor="backup-source" className="text-white">Backup source database</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="point-in-time" />
                        <Label htmlFor="point-in-time" className="text-white">Point-in-time recovery</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Backup Location</Label>
                    <Input 
                      placeholder="/backups/migration-backup-{timestamp}"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 7: Review & Launch */}
          {currentStep === 7 && (
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
                        <span className="text-gray-400">Estimated Duration:</span>
                        <span className="text-white">6.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Complexity Score:</span>
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">7.2/10</Badge>
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
                      { check: 'Backup preparation', status: 'warning' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white">{item.check}</span>
                        <div className="flex items-center">
                          {item.status === 'passed' && <CheckCircle className="h-5 w-5 text-green-400" />}
                          {item.status === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-400" />}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Pre-Migration Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Source database backup completed',
                      'Target database connectivity verified',
                      'All field mappings reviewed',
                      'Security settings configured',
                      'Migration window scheduled',
                      'Rollback plan prepared'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`checklist-${index}`} />
                        <Label htmlFor={`checklist-${index}`} className="text-white text-sm">{item}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button className="flex-1 bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
                <Button className="flex-1 bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
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
            disabled={currentStep === 1 && (!wizardData.sourceDb || !wizardData.targetDb)}
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
