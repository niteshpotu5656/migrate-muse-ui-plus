
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileJson2 } from 'lucide-react';
import { useWizard } from './wizard/WizardContext';

interface FieldMappingConfigProps {
  sourceFields: string[];
  targetFields: string[];
  onFieldMappingsChange: (mappings: any[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const FieldMappingConfig: React.FC<FieldMappingConfigProps> = ({
  sourceFields,
  targetFields,
  onFieldMappingsChange,
  onBack,
  onNext
}) => {
  const { state } = useWizard();
  
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileJson2 className="h-6 w-6 mr-3 text-indigo-400" />
          Field Mapping Configuration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Map source fields to target fields
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <p className="text-white">Configure field mappings between source and target databases.</p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400">Source Fields: {sourceFields.join(', ')}</p>
            <p className="text-sm text-gray-400">Target Fields: {targetFields.join(', ')}</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-gray-600 bg-gray-800 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
          >
            Next Step <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
