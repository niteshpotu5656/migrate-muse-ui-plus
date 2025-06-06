
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ListChecks, AlertCircle } from 'lucide-react';
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
  const { state, updateState } = useWizard();
  const [newRule, setNewRule] = useState({ field: fields[0] || '', rule: 'notNull' });

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
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
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
              <Button onClick={addRule} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </div>
          </div>
        </div>
        
        {/* List of validation rules */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
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
      </CardContent>
    </div>
  );
};
