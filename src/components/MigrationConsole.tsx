
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConsoleLogStream } from './ConsoleLogStream';
import { 
  Play, 
  Pause, 
  Square, 
  Database, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface MigrationConsoleProps {
  isActive: boolean;
  onMigrationComplete: () => void;
}

export const MigrationConsole: React.FC<MigrationConsoleProps> = ({ 
  isActive, 
  onMigrationComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing...');
  const [migrationStats, setMigrationStats] = useState({
    totalTables: 12,
    completedTables: 0,
    totalRows: 45623,
    migratedRows: 0,
    estimatedTimeRemaining: '8m 45s'
  });

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      'Initializing migration...',
      'Connecting to databases...',
      'Analyzing schema...',
      'Migrating table: users...',
      'Migrating table: orders...',
      'Migrating table: products...',
      'Running validation checks...',
      'Finalizing migration...',
      'Migration completed!'
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      if (phaseIndex < phases.length - 1) {
        setCurrentPhase(phases[phaseIndex]);
        setProgress((phaseIndex / (phases.length - 1)) * 100);
        
        // Update stats
        setMigrationStats(prev => ({
          ...prev,
          completedTables: Math.floor((phaseIndex / (phases.length - 1)) * prev.totalTables),
          migratedRows: Math.floor((phaseIndex / (phases.length - 1)) * prev.totalRows),
          estimatedTimeRemaining: phaseIndex > 6 ? '1m 30s' : phaseIndex > 4 ? '3m 15s' : '8m 45s'
        }));
        
        phaseIndex++;
      } else {
        setCurrentPhase(phases[phases.length - 1]);
        setProgress(100);
        setMigrationStats(prev => ({
          ...prev,
          completedTables: prev.totalTables,
          migratedRows: prev.totalRows,
          estimatedTimeRemaining: 'Complete'
        }));
        onMigrationComplete();
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, onMigrationComplete]);

  return (
    <div className="space-y-6">
      {/* Migration Status */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Migration Progress
            </div>
            <Badge className={isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
              {isActive ? 'Running' : 'Idle'}
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-400">
            {currentPhase}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{migrationStats.completedTables}/{migrationStats.totalTables}</div>
              <div className="text-sm text-gray-400">Tables Migrated</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{migrationStats.migratedRows.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Rows Processed</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{migrationStats.estimatedTimeRemaining}</div>
              <div className="text-sm text-gray-400">Time Remaining</div>
            </div>
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={!isActive}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              disabled={!isActive}
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Console Log Stream */}
      <ConsoleLogStream isActive={isActive} migrationId="migration_1234" />
    </div>
  );
};
