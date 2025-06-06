
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, Settings, ArrowRight, Play } from 'lucide-react';
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
  const { state, updateState } = useWizard();

  const handleBatchSizeChange = (value: string) => {
    const batchSize = parseInt(value, 10) || 1000;
    updateState({ dryRunOptions: { ...state.dryRunOptions, batchSize } });
  };

  const toggleValidation = (checked: boolean) => {
    updateState({ dryRunOptions: { ...state.dryRunOptions, enableValidation: checked } });
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
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label className="text-white flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Batch Size
              </Label>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Number of records to process in each batch</p>
                <Input
                  type="number"
                  min={100}
                  max={10000}
                  value={state.dryRunOptions.batchSize}
                  onChange={(e) => handleBatchSizeChange(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white"
                />
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
            
            <div className="pt-4">
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Run Simulation Test</span>
              </Button>
              <p className="text-xs text-gray-400 text-center mt-2">
                This will not modify any data in the target database
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
