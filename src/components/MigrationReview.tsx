
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MigrationReviewProps {
  migrationState: any;
  onBack: () => void;
  onNext: () => void;
}

export const MigrationReview: React.FC<MigrationReviewProps> = ({
  migrationState,
  onBack,
  onNext
}) => {
  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Migration Review</CardTitle>
        <CardDescription className="text-gray-400">
          Review all migration settings before execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-white">
          <p>Review your migration configuration:</p>
          <div className="mt-4 space-y-2 text-sm text-gray-300">
            <p>Source: {migrationState?.sourceConfig?.type || 'Not configured'}</p>
            <p>Target: {migrationState?.targetConfig?.type || 'Not configured'}</p>
            <p>Field Mappings: {migrationState?.fieldMappings?.length || 0}</p>
            <p>Validation Rules: {migrationState?.validationRules?.length || 0}</p>
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
            Start Migration <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
