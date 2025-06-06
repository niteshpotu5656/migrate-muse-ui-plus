
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Loader2 } from 'lucide-react';

interface MigrationExecutionProps {
  migrationState: any;
  onMigrationStart: () => void;
}

export const MigrationExecution: React.FC<MigrationExecutionProps> = ({
  migrationState,
  onMigrationStart
}) => {
  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Migration Execution</CardTitle>
        <CardDescription className="text-gray-400">
          Execute your database migration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-white">
          <p>Ready to start the migration process.</p>
          <div className="mt-4">
            <Progress value={0} className="bg-white/10" />
            <p className="text-sm text-gray-400 mt-2">Progress: 0%</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={onMigrationStart}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Migration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
