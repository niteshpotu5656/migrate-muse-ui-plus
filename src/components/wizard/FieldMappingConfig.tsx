
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowDown } from 'lucide-react';
import { useWizard } from './WizardContext';
import { ArrowRight } from 'lucide-react';

interface FieldMappingConfigProps {
  sourceFields: string[];
  targetFields: string[];
}

export const FieldMappingConfig: React.FC<FieldMappingConfigProps> = ({
  sourceFields,
  targetFields
}) => {
  const { state, updateState } = useWizard();
  const [newMapping, setNewMapping] = useState({ sourceField: sourceFields[0], targetField: targetFields[0] });
  
  const addFieldMapping = () => {
    if (newMapping.sourceField && newMapping.targetField) {
      // Check if this mapping already exists
      const exists = state.fieldMappings.some(
        mapping => mapping.sourceField === newMapping.sourceField && 
                  mapping.targetField === newMapping.targetField
      );
      
      if (!exists) {
        updateState({
          fieldMappings: [...state.fieldMappings, { ...newMapping }]
        });
        
        // Select next available fields for the next mapping
        const nextSourceField = sourceFields.find(field => 
          !state.fieldMappings.some(mapping => mapping.sourceField === field)
        );
        const nextTargetField = targetFields.find(field => 
          !state.fieldMappings.some(mapping => mapping.targetField === field)
        );
        
        setNewMapping({ 
          sourceField: nextSourceField || sourceFields[0], 
          targetField: nextTargetField || targetFields[0] 
        });
      }
    }
  };
  
  const removeFieldMapping = (index: number) => {
    const updatedMappings = [...state.fieldMappings];
    updatedMappings.splice(index, 1);
    updateState({ fieldMappings: updatedMappings });
  };

  const autoMapFields = () => {
    // Simple auto-mapping that tries to find exact matches or similar field names
    const autoMappings = [];
    
    // First try exact matches
    for (const sourceField of sourceFields) {
      const exactMatch = targetFields.find(target => target.toLowerCase() === sourceField.toLowerCase());
      if (exactMatch) {
        autoMappings.push({ sourceField, targetField: exactMatch });
      }
    }
    
    // Then try to find similar field names for unmapped source fields
    const unmappedSourceFields = sourceFields.filter(source => 
      !autoMappings.some(mapping => mapping.sourceField === source)
    );
    
    for (const sourceField of unmappedSourceFields) {
      // Check if target field contains the source field name or vice versa
      const similarMatch = targetFields.find(target => 
        target.toLowerCase().includes(sourceField.toLowerCase()) ||
        sourceField.toLowerCase().includes(target.toLowerCase())
      );
      
      if (similarMatch) {
        autoMappings.push({ sourceField, targetField: similarMatch });
      }
    }
    
    // Update state with auto mappings
    updateState({ fieldMappings: autoMappings });
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <ArrowRight className="h-6 w-6 mr-3 text-indigo-400" />
          Field Mapping Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Define how fields are mapped between source and target databases
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add field mapping */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Map Database Fields</CardTitle>
            <CardDescription className="text-gray-400">
              Define relationships between source and target database fields
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
              <div className="md:col-span-3 space-y-2">
                <Label className="text-white">Source Field</Label>
                <Select 
                  value={newMapping.sourceField} 
                  onValueChange={(value) => setNewMapping({ ...newMapping, sourceField: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Select source field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceFields.map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-center items-center">
                <ArrowDown className="h-5 w-5 text-indigo-400 md:rotate-90" />
              </div>
              
              <div className="md:col-span-3 space-y-2">
                <Label className="text-white">Target Field</Label>
                <Select 
                  value={newMapping.targetField} 
                  onValueChange={(value) => setNewMapping({ ...newMapping, targetField: value })}
                >
                  <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                    <SelectValue placeholder="Select target field" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetFields.map(field => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Button onClick={addFieldMapping} className="w-full bg-white text-gray-900 hover:bg-gray-100">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={autoMapFields} variant="outline" className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700">
                Auto-Map Fields
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Field mappings table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Field Mappings</CardTitle>
            <CardDescription className="text-gray-400">
              {state.fieldMappings.length} field mappings defined
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.fieldMappings.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-gray-600 rounded-lg bg-gray-900">
                <p className="text-gray-400">No field mappings defined yet.</p>
                <p className="text-sm text-gray-500 mt-1">Add mappings using the form above or click Auto-Map.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.fieldMappings.map((mapping, index) => (
                  <div key={index} className="flex items-center bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                      <div className="md:col-span-2">
                        <Label className="text-xs text-gray-400 md:hidden">Source Field</Label>
                        <p className="text-white font-medium">{mapping.sourceField}</p>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="h-5 w-5 text-indigo-400" />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label className="text-xs text-gray-400 md:hidden">Target Field</Label>
                        <p className="text-white font-medium">{mapping.targetField}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFieldMapping(index)} 
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};
