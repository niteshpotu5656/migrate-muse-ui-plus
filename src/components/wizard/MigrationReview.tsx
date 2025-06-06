
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Database, ArrowRight, XCircle, AlertTriangle, FileText, Download } from 'lucide-react';
import { useWizard } from './WizardContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const MigrationReviewComponent: React.FC = () => {
  const { state } = useWizard();
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  
  // Helper function to get DB display name
  const getDbDisplayName = (dbType: string) => {
    const dbNames: Record<string, string> = {
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
      redis: 'Redis',
      oracle: 'Oracle',
      cassandra: 'Cassandra',
      elasticsearch: 'Elasticsearch',
      neo4j: 'Neo4j'
    };
    
    return dbNames[dbType] || dbType;
  };
  
  const exportReport = () => {
    setIsExporting(true);
    
    // Display a loading toast
    toast({
      title: "Generating Export...",
      description: `Preparing ${exportFormat.toUpperCase()} report for your migration.`,
    });
    
    setTimeout(() => {
      toast({
        title: "✅ Export Complete",
        description: `Migration report has been exported as ${exportFormat.toUpperCase()}.`,
        variant: "default",
      });
      
      setIsExporting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <CheckCircle className="h-6 w-6 mr-3 text-indigo-400" />
          Migration Review
        </CardTitle>
        <CardDescription className="text-gray-400">
          Confirm the details of your database migration before proceeding
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Migration Summary Card */}
        <Card className="bg-gray-800 border-gray-700 shadow-md">
          <CardHeader className="bg-gray-900 border-b border-gray-700 rounded-t-lg">
            <CardTitle className="text-white text-lg">Migration Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Source Database */}
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-indigo-400 text-sm font-medium mb-2">Source Database</h3>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-900/20 border border-blue-700/30 flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{getDbDisplayName(state.sourceConfig.type)}</p>
                      <p className="text-sm text-gray-400">{state.sourceConfig.host}:{state.sourceConfig.port}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Database</p>
                      <p className="text-sm text-gray-300">{state.sourceConfig.database}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">SSL</p>
                      <p className="text-sm text-gray-300">{state.sourceConfig.useSSL ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>

                {/* Target Database */}
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-indigo-400 text-sm font-medium mb-2">Target Database</h3>
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-900/20 border border-green-700/30 flex items-center justify-center">
                      <Database className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{getDbDisplayName(state.targetConfig.type)}</p>
                      <p className="text-sm text-gray-400">{state.targetConfig.host}:{state.targetConfig.port}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Database</p>
                      <p className="text-sm text-gray-300">{state.targetConfig.database}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">SSL</p>
                      <p className="text-sm text-gray-300">{state.targetConfig.useSSL ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Migration Configuration */}
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-indigo-400 text-sm font-medium mb-2">Migration Configuration</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-gray-300">Batch Size</p>
                      <p className="text-white font-medium">{state.dryRunOptions.batchSize.toLocaleString()} records</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-300">Data Validation</p>
                      <Badge className={`${
                        state.dryRunOptions.enableValidation 
                          ? 'bg-green-900/20 text-green-400 border-green-700/30'
                          : 'bg-gray-700 text-gray-300 border-gray-600'
                      }`}>
                        {state.dryRunOptions.enableValidation ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-300">Truncate Target</p>
                      <Badge className={`${
                        state.migrationOptions.truncateTarget 
                          ? 'bg-red-900/20 text-red-400 border-red-700/30'
                          : 'bg-gray-700 text-gray-300 border-gray-600'
                      }`}>
                        {state.migrationOptions.truncateTarget ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Pre-Check Status */}
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <h3 className="text-indigo-400 text-sm font-medium mb-2">Pre-Check Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">Validation</p>
                      {state.validationPassed ? (
                        <Badge className="bg-green-900/20 text-green-400 border-green-700/30 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" /> Passed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-900/20 text-red-400 border-red-700/30 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" /> Failed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">Dry Run</p>
                      {state.dryRunPassed ? (
                        <Badge className="bg-green-900/20 text-green-400 border-green-700/30 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" /> Passed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-900/20 text-red-400 border-red-700/30 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" /> Failed
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">Overall Status</p>
                      {state.validationPassed && state.dryRunPassed ? (
                        <Badge className="bg-green-900/20 text-green-400 border-green-700/30 flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" /> Ready
                        </Badge>
                      ) : (
                        <Badge className="bg-red-900/20 text-red-400 border-red-700/30 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Not Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Export Section */}
        <Card className="bg-gray-800 border-gray-700 shadow-md">
          <CardHeader className="bg-gray-900 border-b border-gray-700 rounded-t-lg">
            <CardTitle className="text-white text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-400" />
              Export Migration Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2 md:col-span-2">
                <Label>Export Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="json">JSON Data</SelectItem>
                    <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={exportReport}
                disabled={isExporting}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                {isExporting ? (
                  <>Exporting...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Final Notice */}
        <div className={`p-4 rounded-lg border ${
          state.validationPassed && state.dryRunPassed
            ? 'bg-indigo-900/20 border-indigo-700/30'
            : 'bg-red-900/20 border-red-700/30'
        }`}>
          <div className="flex items-start space-x-4">
            {state.validationPassed && state.dryRunPassed ? (
              <div className="h-10 w-10 rounded-full bg-indigo-900/30 flex items-center justify-center shrink-0">
                <ArrowRight className="h-5 w-5 text-indigo-400" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
            )}
            <div>
              <h3 className={`font-medium text-lg ${
                state.validationPassed && state.dryRunPassed ? 'text-indigo-400' : 'text-red-400'
              }`}>
                {state.validationPassed && state.dryRunPassed 
                  ? 'Ready to Begin Migration' 
                  : 'Migration Not Ready'}
              </h3>
              <p className="text-gray-300">
                {state.validationPassed && state.dryRunPassed 
                  ? 'All pre-checks have passed. You can now proceed to the actual migration process.' 
                  : 'Some pre-checks failed. Please go back and fix the issues before proceeding.'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

// Helper components
const Label: React.FC<React.PropsWithChildren> = ({ children }) => (
  <label className="text-white mb-1 block">{children}</label>
);
