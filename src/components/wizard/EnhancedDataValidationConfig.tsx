
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ListChecks, AlertCircle, Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useWizard } from './WizardContext';

interface EnhancedDataValidationConfigProps {
  fields: string[];
  onBack: () => void;
  onNext: () => void;
}

export const EnhancedDataValidationConfig: React.FC<EnhancedDataValidationConfigProps> = ({
  fields,
  onBack,
  onNext
}) => {
  const { state, updateState, setValidationPassed } = useWizard();
  const [newRule, setNewRule] = useState({ field: fields[0] || '', rule: 'notNull' });
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    details: {field: string, failures: number, status: 'success' | 'warning' | 'error'}[]
  } | null>(null);
  const { toast } = useToast();

  const validationTypes = [
    { id: 'notNull', name: 'Not Null', description: 'Field must not be null' },
    { id: 'numeric', name: 'Numeric', description: 'Field must contain only numeric values' },
    { id: 'email', name: 'Valid Email', description: 'Field must be a valid email address' },
    { id: 'length', name: 'Length Check', description: 'Field must have specific length' },
    { id: 'range', name: 'Value Range', description: 'Field must be within a numeric range' },
    { id: 'regex', name: 'Regex Pattern', description: 'Field must match a regular expression' }
  ];

  const addRule = () => {
    if (newRule.field && newRule.rule) {
      const updatedRules = [...state.validationRules, { ...newRule }];
      updateState({ validationRules: updatedRules });
      setNewRule({ field: fields[0] || '', rule: 'notNull' });
    }
  };

  const removeRule = (index: number) => {
    const updatedRules = [...state.validationRules];
    updatedRules.splice(index, 1);
    updateState({ validationRules: updatedRules });
  };

  const runValidation = () => {
    // Reset any previous validation
    setValidationPassed(false);
    setIsValidating(true);
    setValidationResults(null);
    
    // Simulate validation delay
    setTimeout(() => {
      // Generate random results for simulation
      const totalRecords = 10000 + Math.floor(Math.random() * 90000);
      const validPercent = Math.random() * 0.2 + 0.8; // 80-100% valid
      const validRecords = Math.floor(totalRecords * validPercent);
      const invalidRecords = totalRecords - validRecords;
      
      // Generate detailed results for each rule
      const details = state.validationRules.map(rule => {
        const failureRate = Math.random() * 0.1; // 0-10% failure rate
        const failures = Math.floor(totalRecords * failureRate);
        
        let status: 'success' | 'warning' | 'error';
        if (failures === 0) status = 'success';
        else if (failures < totalRecords * 0.05) status = 'warning';
        else status = 'error';
        
        return {
          field: rule.field,
          failures,
          status
        };
      });
      
      const results = {
        totalRecords,
        validRecords,
        invalidRecords,
        details
      };
      
      setValidationResults(results);
      setIsValidating(false);
      
      // Determine if validation passed based on error threshold (5%)
      const passed = invalidRecords < (totalRecords * 0.05);
      setValidationPassed(passed);
      
      // Show toast notification
      toast({
        title: passed ? '✅ Validation Passed' : '❌ Validation Issues Detected',
        description: passed 
          ? `Successfully validated ${validRecords.toLocaleString()} of ${totalRecords.toLocaleString()} records.`
          : `Found ${invalidRecords.toLocaleString()} issues in ${totalRecords.toLocaleString()} records. Review and fix issues before proceeding.`,
        variant: passed ? 'default' : 'destructive',
      });
      
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <ListChecks className="h-6 w-6 mr-3 text-indigo-400" />
          Data Validation Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Set up validation rules to ensure data integrity during migration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new validation rule */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-md">
          <h3 className="text-white text-lg font-medium mb-4">Add Validation Rule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Field</Label>
              <Select 
                value={newRule.field} 
                onValueChange={(value) => setNewRule({...newRule, field: value})}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Validation Type</Label>
              <Select 
                value={newRule.rule} 
                onValueChange={(value) => setNewRule({...newRule, rule: value})}
              >
                <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Select validation" />
                </SelectTrigger>
                <SelectContent>
                  {validationTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addRule} className="w-full bg-white text-gray-900 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </div>
        </div>
        
        {/* List of validation rules */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-md">
          <h3 className="text-white text-lg font-medium mb-4">Validation Rules</h3>
          
          {state.validationRules.length === 0 ? (
            <div className="flex items-center justify-center p-6 border border-dashed border-gray-600 rounded-lg bg-gray-900">
              <div className="text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p className="text-gray-400">No validation rules configured yet.</p>
                <p className="text-gray-500 text-sm mt-1">Add rules to ensure data quality during migration.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {state.validationRules.map((rule, index) => {
                const ruleType = validationTypes.find(t => t.id === rule.rule);
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded-md border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center">
                        <ListChecks className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{rule.field}</p>
                        <p className="text-gray-400 text-sm">{ruleType?.name || rule.rule}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeRule(index)} 
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Run validation section */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-medium">Run Validation Check</h3>
            <Button
              onClick={runValidation}
              disabled={state.validationRules.length === 0 || isValidating}
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Validation
                </>
              )}
            </Button>
          </div>
          
          {validationResults && (
            <div className="mt-4 space-y-4">
              {/* Results summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-400 text-sm mb-1">Total Records</p>
                  <p className="text-white text-2xl font-semibold">
                    {validationResults.totalRecords.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-green-700/30 bg-green-900/10">
                  <p className="text-gray-400 text-sm mb-1">Valid Records</p>
                  <p className="text-green-400 text-2xl font-semibold">
                    {validationResults.validRecords.toLocaleString()}
                  </p>
                </div>
                <div className={`bg-gray-900 rounded-lg p-4 border ${
                  validationResults.invalidRecords > 0 
                    ? 'border-red-700/30 bg-red-900/10' 
                    : 'border-gray-700'
                }`}>
                  <p className="text-gray-400 text-sm mb-1">Invalid Records</p>
                  <p className={`text-2xl font-semibold ${
                    validationResults.invalidRecords > 0 
                      ? 'text-red-400' 
                      : 'text-gray-300'
                  }`}>
                    {validationResults.invalidRecords.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* Field validation details */}
              <div className="space-y-2">
                <h4 className="text-white font-medium mb-2">Field Validation Results</h4>
                {validationResults.details.map((detail, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-900 p-3 rounded-md border border-gray-700">
                    <div className="flex items-center">
                      {detail.status === 'success' ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      ) : detail.status === 'warning' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mr-2" />
                      )}
                      <span className="text-white">{detail.field}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">
                        {detail.failures.toLocaleString()} issues
                      </span>
                      <Badge 
                        className={`${
                          detail.status === 'success' 
                            ? 'bg-green-900/20 text-green-400 border-green-700/30' 
                            : detail.status === 'warning'
                            ? 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30'
                            : 'bg-red-900/20 text-red-400 border-red-700/30'
                        }`}
                      >
                        {detail.status === 'success' ? 'PASS' : detail.status === 'warning' ? 'WARN' : 'FAIL'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Overall validation status */}
              <div className={`p-4 rounded-lg border ${
                state.validationPassed
                  ? 'bg-green-900/20 border-green-700/30' 
                  : 'bg-red-900/20 border-red-700/30'
              }`}>
                <div className="flex items-center">
                  {state.validationPassed ? (
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-400 mr-3" />
                  )}
                  <div>
                    <h4 className={`font-medium ${state.validationPassed ? 'text-green-400' : 'text-red-400'}`}>
                      {state.validationPassed ? 'Validation Passed' : 'Validation Failed'}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {state.validationPassed 
                        ? 'Your data passed all validation checks. You can proceed to the next step.' 
                        : 'Some validation checks failed. Review and fix the issues before continuing.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
};
