
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface DataValidationConfigProps {
  fields: string[];
  onValidationRulesChange: (rules: any[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export const DataValidationConfig: React.FC<DataValidationConfigProps> = ({
  fields,
  onValidationRulesChange,
  onBack,
  onNext
}) => {
  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Data Validation Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Set up validation rules for your migration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-white">
          <p>Configure validation rules to ensure data integrity during migration.</p>
          <div className="mt-4">
            <p className="text-sm text-gray-400">Available Fields: {fields.join(', ')}</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-white/20 text-gray-900 bg-white hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onNext}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
          >
            Next Step <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
