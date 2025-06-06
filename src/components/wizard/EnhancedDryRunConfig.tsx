
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Search, Settings, ArrowRight, Play, FileText, AlertTriangle, CheckCircle, Loader2, Clock } from 'lucide-react';
import { useWizard } from './WizardContext';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedDryRunConfigProps {
  onBack: () => void;
  onNext: () => void;
}

export const EnhancedDryRunConfig: React.FC<EnhancedDryRunConfigProps> = ({
  onBack,
  onNext
}) => {
  const { state, updateState, addMigrationLog, resetMigrationLogs, setDryRunPassed } = useWizard();
  const [isDryRunning, setIsDryRunning] = useState(false);
  const [dryRunProgress, setDryRunProgress] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [complexity, setComplexity] = useState<number>(0);
  const [statsData, setStatsData] = useState<{
    recordsProcessed: number;
    totalTime: number; // seconds
    speed: number; // records per second
    warnings: number;
    errors: number;
    dataTypeMismatches: number;
  } | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleBatchSizeChange = (value: string) => {
    const batchSize = parseInt(value, 10) || 1000;
    updateState({ dryRunOptions: { ...state.dryRunOptions, batchSize } });
  };

  const toggleValidation = (checked: boolean) => {
    updateState({ dryRunOptions: { ...state.dryRunOptions, enableValidation: checked } });
  };
  
  // Auto-scroll logs to bottom when new logs are added
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [state.migrationLogs]);

  const runDryRun = () => {
    // Reset any previous simulation
    resetMigrationLogs();
    setDryRunPassed(false);
    setIsDryRunning(true);
    setDryRunProgress(0);
    setStatsData(null);
    
    // Generate a random complexity value (1-10)
    const newComplexity = Math.floor(Math.random() * 10) + 1;
    setComplexity(newComplexity);
    
    // Get timing based on simulation speed
    let interval = 500; // ms
    if (simulationSpeed === 'slow') interval = 1000;
    if (simulationSpeed === 'fast') interval = 250;
    
    // Show initial toast
    toast({
      title: "Starting Dry Run",
      description: "Preparing to simulate data migration...",
    });
    
    // Add initial logs
    addMigrationLog("Initializing dry run simulation...");
    addMigrationLog(`Source database: ${state.sourceConfig.type} at ${state.sourceConfig.host}:${state.sourceConfig.port}`);
    addMigrationLog(`Target database: ${state.targetConfig.type} at ${state.targetConfig.host}:${state.targetConfig.port}`);
    addMigrationLog(`Batch size: ${state.dryRunOptions.batchSize} records`);
    addMigrationLog(`Validation enabled: ${state.dryRunOptions.enableValidation ? 'Yes' : 'No'}`);
    addMigrationLog("Analyzing schema compatibility...");
    
    // Simulate progress
    let progress = 0;
    const totalBatches = Math.floor(10000 / interval);
    let currentBatch = 0;
    
    const progressSimulator = setInterval(() => {
      currentBatch++;
      progress = Math.min(Math.floor((currentBatch / totalBatches) * 100), 100);
      setDryRunProgress(progress);
      
      // Generate logs at different stages
      if (progress === 20) {
        addMigrationLog("Schema analysis complete. Proceeding with data structure validation.");
      } else if (progress === 40) {
        addMigrationLog("Testing foreign key relationships and referential integrity.");
        if (newComplexity > 5) {
          addMigrationLog("WARNING: Complex relationships detected between tables.");
          addMigrationLog(`Found ${Math.floor(Math.random() * 5) + 2} circular dependencies.`);
        }
      } else if (progress === 60) {
        addMigrationLog(`Processing sample data batch (${state.dryRunOptions.batchSize} records)...`);
        if (newComplexity > 7) {
          addMigrationLog("ERROR: Data type mismatch in 3 fields.");
          addMigrationLog("Column 'user_id' expected type: INT, found: VARCHAR in some records");
        }
      } else if (progress === 80) {
        addMigrationLog("Validating transformation rules and constraints.");
        addMigrationLog(`Processed ${Math.floor(Math.random() * 50000) + 10000} sample records.`);
      } else if (progress === 100) {
        // Complete the dry run
        clearInterval(progressSimulator);
        setIsDryRunning(false);
        
        // Generate random stats
        const recordsProcessed = Math.floor(Math.random() * 50000) + 10000;
        const totalTime = Math.floor(Math.random() * 120) + 30; // 30-150 seconds
        const warnings = newComplexity > 5 ? Math.floor(Math.random() * 10) + 3 : Math.floor(Math.random() * 3);
        const errors = newComplexity > 7 ? Math.floor(Math.random() * 5) + 1 : 0;
        const typeMismatches = newComplexity > 6 ? Math.floor(Math.random() * 4) + 1 : 0;
        
        // Set final stats
        setStatsData({
          recordsProcessed,
          totalTime,
          speed: Math.floor(recordsProcessed / totalTime),
          warnings,
          errors,
          dataTypeMismatches: typeMismatches
        });
        
        // Add completion log
        addMigrationLog("Dry run completed.");
        addMigrationLog(`Total records processed: ${recordsProcessed}`);
        addMigrationLog(`Total time: ${totalTime} seconds`);
        addMigrationLog(`Warnings: ${warnings}`);
        addMigrationLog(`Errors: ${errors}`);
        
        // Determine if dry run passed
        const passed = errors === 0;
        setDryRunPassed(passed);
        
        // Show completion toast
        toast({
          title: passed ? "✅ Dry Run Complete" : "❌ Dry Run Failed",
          description: passed 
            ? `Successfully processed ${recordsProcessed} records with ${warnings} warnings.` 
            : `Encountered ${errors} errors during dry run. Fix issues before proceeding.`,
          variant: passed ? 'default' : 'destructive',
        });
      } else if (progress % 10 === 0) {
        // Add random log every 10%
        const randomLogs = [
          "Checking column mapping compatibility...",
          "Validating primary key constraints...",
          "Testing batch insertion performance...",
          "Evaluating index structures...",
          "Checking encoding compatibility...",
          "Verifying transaction boundaries..."
        ];
        addMigrationLog(randomLogs[Math.floor(Math.random() * randomLogs.length)]);
      }
      
    }, interval);
  };
  
  const getComplexityColor = () => {
    if (complexity <= 3) return "text-green-400";
    if (complexity <= 6) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getComplexityLabel = () => {
    if (complexity <= 3) return "Low";
    if (complexity <= 6) return "Medium";
    return "High";
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="h-6 w-6 mr-3 text-indigo-400" />
          Dry Run Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Set up options for testing your migration before execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuration options */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-md">
            <h3 className="text-white text-lg font-medium mb-4">Configuration Options</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-white flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Batch Size
                </Label>
                <Select value={state.dryRunOptions.batchSize.toString()} onValueChange={handleBatchSizeChange}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Select batch size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">Small - 100 records</SelectItem>
                    <SelectItem value="1000">Medium - 1,000 records</SelectItem>
                    <SelectItem value="5000">Large - 5,000 records</SelectItem>
                    <SelectItem value="10000">X-Large - 10,000 records</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-white flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Validation Options
                </Label>
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-white">Enable Data Validation</p>
                    <p className="text-sm text-gray-400">Validate data integrity during dry run</p>
                  </div>
                  <Switch
                    checked={state.dryRunOptions.enableValidation}
                    onCheckedChange={toggleValidation}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-white flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Simulation Speed
                </Label>
                <Select value={simulationSpeed} onValueChange={(value: 'slow' | 'normal' | 'fast') => setSimulationSpeed(value)}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Select simulation speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow (More Detailed)</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast (Less Detailed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={runDryRun}
                disabled={isDryRunning}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-medium"
              >
                {isDryRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation Test
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                This will not modify any data in the target database
              </p>
            </div>
          </div>
          
          {/* Console output */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-medium">Dry Run Console</h3>
              {isDryRunning && (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 text-indigo-400 animate-spin" />
                  <span className="text-indigo-400 text-sm">Running...</span>
                </div>
              )}
            </div>
            
            {/* Progress bar */}
            {(isDryRunning || dryRunProgress > 0) && (
              <div className="mb-4 space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span>{dryRunProgress}%</span>
                </div>
                <Progress value={dryRunProgress} className="h-2 bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" 
                    style={{ width: `${dryRunProgress}%` }}
                  />
                </Progress>
              </div>
            )}
            
            {/* Console logs */}
            <div 
              ref={logsContainerRef}
              className="h-64 overflow-y-auto bg-gray-900 rounded-md border border-gray-700 p-3 font-mono text-xs"
            >
              {state.migrationLogs.length === 0 ? (
                <p className="text-gray-500">Run a dry test to see logs here...</p>
              ) : (
                state.migrationLogs.map((log, index) => {
                  // Color code different types of logs
                  let logClass = 'text-gray-300';
                  if (log.includes('ERROR')) logClass = 'text-red-400';
                  else if (log.includes('WARNING')) logClass = 'text-yellow-400';
                  else if (log.includes('complete')) logClass = 'text-green-400';
                  
                  return (
                    <div key={index} className={`py-1 ${logClass}`}>
                      {log}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
        
        {/* Results section (shown after dry run completes) */}
        {statsData && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-md">
            <h3 className="text-white text-xl font-medium mb-4">Dry Run Results</h3>
            
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Records Processed</p>
                <p className="text-white text-xl font-semibold">{statsData.recordsProcessed.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Processing Time</p>
                <p className="text-white text-xl font-semibold">{statsData.totalTime} seconds</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-xs mb-1">Processing Speed</p>
                <p className="text-white text-xl font-semibold">{statsData.speed.toLocaleString()} rec/s</p>
              </div>
              <div className={`bg-gray-900 p-4 rounded-lg border ${
                complexity <= 3 
                  ? 'border-green-700/30' 
                  : complexity <= 6 
                  ? 'border-yellow-700/30'
                  : 'border-red-700/30'
              }`}>
                <p className="text-gray-400 text-xs mb-1">Migration Complexity</p>
                <div className="flex items-center">
                  <p className={`${getComplexityColor()} text-xl font-semibold`}>{getComplexityLabel()}</p>
                  <p className="text-gray-400 text-sm ml-2">({complexity}/10)</p>
                </div>
              </div>
            </div>
            
            {/* Issues summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`bg-gray-900 p-4 rounded-lg border ${
                statsData.warnings > 0 ? 'border-yellow-700/30' : 'border-gray-700'
              }`}>
                <div className="flex items-center mb-2">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    statsData.warnings > 0 ? 'text-yellow-400' : 'text-gray-400'
                  }`} />
                  <p className="text-white font-medium">Warnings</p>
                </div>
                <p className={`text-2xl font-semibold ${
                  statsData.warnings > 0 ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {statsData.warnings}
                </p>
              </div>
              
              <div className={`bg-gray-900 p-4 rounded-lg border ${
                statsData.errors > 0 ? 'border-red-700/30' : 'border-gray-700'
              }`}>
                <div className="flex items-center mb-2">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    statsData.errors > 0 ? 'text-red-400' : 'text-gray-400'
                  }`} />
                  <p className="text-white font-medium">Errors</p>
                </div>
                <p className={`text-2xl font-semibold ${
                  statsData.errors > 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {statsData.errors}
                </p>
              </div>
              
              <div className={`bg-gray-900 p-4 rounded-lg border ${
                statsData.dataTypeMismatches > 0 ? 'border-orange-700/30' : 'border-gray-700'
              }`}>
                <div className="flex items-center mb-2">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${
                    statsData.dataTypeMismatches > 0 ? 'text-orange-400' : 'text-gray-400'
                  }`} />
                  <p className="text-white font-medium">Type Mismatches</p>
                </div>
                <p className={`text-2xl font-semibold ${
                  statsData.dataTypeMismatches > 0 ? 'text-orange-400' : 'text-gray-400'
                }`}>
                  {statsData.dataTypeMismatches}
                </p>
              </div>
            </div>
            
            {/* Overall status */}
            <div className={`p-4 rounded-lg ${
              state.dryRunPassed 
                ? 'bg-green-900/20 border border-green-700/30' 
                : 'bg-red-900/20 border border-red-700/30'
            }`}>
              <div className="flex items-center">
                {state.dryRunPassed ? (
                  <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
                )}
                <div>
                  <h4 className={`text-lg font-medium ${
                    state.dryRunPassed ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {state.dryRunPassed ? 'Dry Run Successful' : 'Dry Run Failed'}
                  </h4>
                  <p className="text-gray-300">
                    {state.dryRunPassed 
                      ? 'The simulation completed successfully. You can proceed to the actual migration.' 
                      : 'The simulation encountered errors. Fix these issues before proceeding to the migration.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
};
