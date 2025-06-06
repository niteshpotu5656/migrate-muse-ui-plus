
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, StopCircle, Clock, Loader2, Download, CheckCircle } from 'lucide-react';
import { useWizard } from './WizardContext';

export const MigrationExecutionComponent: React.FC = () => {
  const { state, updateMigrationProgress, addMigrationLog, resetMigrationLogs } = useWizard();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null);
  const [recordsProcessed, setRecordsProcessed] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [processingSpeed, setProcessingSpeed] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timer | null>(null);
  const { toast } = useToast();
  
  // Auto-scroll logs to bottom when new logs are added
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [state.migrationLogs]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startMigration = () => {
    // Reset any previous migration
    resetMigrationLogs();
    updateMigrationProgress(0);
    setIsMigrating(true);
    setMigrationComplete(false);
    setTimeElapsed(0);
    setEstimatedTimeRemaining(null);
    setRecordsProcessed(0);
    
    // Generate a random total number of records
    const randomTotal = Math.floor(Math.random() * 500000) + 50000;
    setTotalRecords(randomTotal);
    
    // Add initial logs
    addMigrationLog("Starting migration process...");
    addMigrationLog(`Source database: ${state.sourceConfig.type} at ${state.sourceConfig.host}:${state.sourceConfig.port}`);
    addMigrationLog(`Target database: ${state.targetConfig.type} at ${state.targetConfig.host}:${state.targetConfig.port}`);
    addMigrationLog(`Total records to migrate: ${randomTotal.toLocaleString()}`);
    
    // Show initial toast
    toast({
      title: "✅ Migration Started",
      description: `Beginning migration of ${randomTotal.toLocaleString()} records.`,
    });
    
    // Start timers
    const startTime = Date.now();
    let lastUpdateTime = startTime;
    let lastProcessed = 0;
    
    // Update timer every second
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      setTimeElapsed(elapsedSeconds);
      
      // Calculate approximate progress
      const progressPercent = Math.min(elapsedSeconds / 120, 1) * 100;
      const currentProcessed = Math.floor((progressPercent / 100) * randomTotal);
      setRecordsProcessed(currentProcessed);
      updateMigrationProgress(progressPercent);
      
      // Calculate processing speed (records per second)
      const secondsSinceLastUpdate = (currentTime - lastUpdateTime) / 1000;
      if (secondsSinceLastUpdate >= 1) {
        const recordsPerSecond = Math.floor((currentProcessed - lastProcessed) / secondsSinceLastUpdate);
        setProcessingSpeed(recordsPerSecond);
        
        // Update estimated time remaining
        if (recordsPerSecond > 0) {
          const recordsRemaining = randomTotal - currentProcessed;
          const secondsRemaining = Math.floor(recordsRemaining / recordsPerSecond);
          setEstimatedTimeRemaining(secondsRemaining);
        }
        
        lastUpdateTime = currentTime;
        lastProcessed = currentProcessed;
      }
      
      // Add logs every few seconds
      if (elapsedSeconds % 5 === 0 && progressPercent < 100) {
        addMigrationLog(`Migrated ${currentProcessed.toLocaleString()} of ${randomTotal.toLocaleString()} records (${Math.floor(progressPercent)}%)`);
      }
      
      // Add random log messages
      if (elapsedSeconds % 10 === 0 && progressPercent < 100) {
        const randomLogs = [
          "Processing foreign key relationships...",
          "Validating data integrity constraints...",
          "Transforming data structures...",
          "Updating index entries...",
          "Applying user-defined transforms..."
        ];
        addMigrationLog(randomLogs[Math.floor(Math.random() * randomLogs.length)]);
      }
      
      // Complete the migration when progress reaches 100%
      if (progressPercent >= 100 && isMigrating) {
        completeMigration();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 1000);
  };
  
  const completeMigration = () => {
    setIsMigrating(false);
    setMigrationComplete(true);
    updateMigrationProgress(100);
    setRecordsProcessed(totalRecords);
    setEstimatedTimeRemaining(0);
    
    // Add completion logs
    addMigrationLog("Migration completed successfully!");
    addMigrationLog(`Total records migrated: ${totalRecords.toLocaleString()}`);
    addMigrationLog(`Total time elapsed: ${formatTime(timeElapsed)}`);
    addMigrationLog(`Final processing speed: ${processingSpeed.toLocaleString()} records/second`);
    
    // Show completion toast
    toast({
      title: "🎉 Migration Complete",
      description: `Successfully migrated ${totalRecords.toLocaleString()} records.`,
      variant: "default",
    });
  };
  
  const stopMigration = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsMigrating(false);
    addMigrationLog("Migration process was manually stopped.");
    
    toast({
      title: "⚠️ Migration Stopped",
      description: "The migration process has been manually stopped.",
      variant: "destructive",
    });
  };
  
  const exportResults = () => {
    setIsExporting(true);
    
    // Display a loading toast
    toast({
      title: "Generating Export...",
      description: "Preparing migration results for export.",
    });
    
    setTimeout(() => {
      toast({
        title: "✅ Export Complete",
        description: "Migration results have been exported as CSV.",
        variant: "default",
      });
      
      setIsExporting(false);
    }, 2000);
  };
  
  // Helper function to format time in minutes and seconds
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Play className="h-6 w-6 mr-3 text-indigo-400" />
          Migration Execution
        </CardTitle>
        <CardDescription className="text-gray-400">
          Perform the actual database migration process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Card */}
        <Card className="bg-gray-800 border-gray-700 shadow-md">
          <CardHeader className="bg-gray-900 border-b border-gray-700">
            <CardTitle className="text-white text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-400" />
              Migration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-400">Overall Progress</p>
                  <p className="text-white font-medium">{Math.round(state.migrationProgress)}%</p>
                </div>
                <Progress value={state.migrationProgress} className="h-2 bg-gray-700">
                  <div 
                    className={`h-full rounded-full ${
                      migrationComplete 
                        ? 'bg-green-500' 
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                    }`}
                    style={{ width: `${state.migrationProgress}%` }}
                  />
                </Progress>
              </div>
              
              {/* Statistics grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                  <p className="text-gray-400 text-xs mb-1">Records Processed</p>
                  <p className="text-white text-lg font-medium">
                    {recordsProcessed.toLocaleString()}/{totalRecords.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                  <p className="text-gray-400 text-xs mb-1">Time Elapsed</p>
                  <p className="text-white text-lg font-medium">{formatTime(timeElapsed)}</p>
                </div>
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                  <p className="text-gray-400 text-xs mb-1">Est. Time Remaining</p>
                  <p className="text-white text-lg font-medium">
                    {estimatedTimeRemaining !== null ? formatTime(estimatedTimeRemaining) : "--"}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                  <p className="text-gray-400 text-xs mb-1">Processing Speed</p>
                  <p className="text-white text-lg font-medium">
                    {processingSpeed.toLocaleString()} rec/s
                  </p>
                </div>
              </div>
              
              {/* Control buttons */}
              <div className="flex space-x-3">
                {!isMigrating && !migrationComplete && (
                  <Button 
                    onClick={startMigration} 
                    className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Migration
                  </Button>
                )}
                
                {isMigrating && (
                  <Button 
                    onClick={stopMigration}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Migration
                  </Button>
                )}
                
                {migrationComplete && (
                  <Button 
                    onClick={exportResults}
                    disabled={isExporting}
                    className="flex-1 bg-white text-gray-900 hover:bg-gray-100"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Results
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Completion message */}
              {migrationComplete && (
                <div className="p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="text-green-400 font-medium">Migration Completed Successfully</p>
                      <p className="text-gray-300 text-sm">
                        All {totalRecords.toLocaleString()} records have been migrated to the target database.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Migration Logs */}
        <Card className="bg-gray-800 border-gray-700 shadow-md">
          <CardHeader className="bg-gray-900 border-b border-gray-700">
            <CardTitle className="text-white text-lg">Migration Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div 
              ref={logsContainerRef}
              className="h-64 overflow-y-auto bg-gray-900 rounded-md border border-gray-700 p-3 font-mono text-xs"
            >
              {state.migrationLogs.length === 0 ? (
                <p className="text-gray-500">Migration logs will appear here...</p>
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
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};
