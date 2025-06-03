
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Pause, 
  Play, 
  Square, 
  BarChart, 
  Activity,
  Clock,
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';

interface MigrationConsoleProps {
  isActive: boolean;
  onMigrationComplete: () => void;
}

export const MigrationConsole: React.FC<MigrationConsoleProps> = ({ isActive, onMigrationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('running');
  const [logs, setLogs] = useState<Array<{id: number, time: string, level: string, message: string}>>([]);
  const [metrics, setMetrics] = useState({
    recordsProcessed: 0,
    transferRate: 0,
    timeElapsed: 0,
    estimatedRemaining: 0
  });

  useEffect(() => {
    if (isActive && status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 2, 100);
          if (newProgress >= 100) {
            setStatus('completed');
            onMigrationComplete();
          }
          return newProgress;
        });

        setMetrics(prev => ({
          recordsProcessed: prev.recordsProcessed + Math.floor(Math.random() * 1000),
          transferRate: 2.1 + Math.random() * 0.8,
          timeElapsed: prev.timeElapsed + 1,
          estimatedRemaining: Math.max(0, prev.estimatedRemaining - 1)
        }));

        // Add random log entries
        if (Math.random() < 0.3) {
          const logLevels = ['info', 'success', 'warning'];
          const messages = [
            'Processing table: users',
            'Schema conversion completed',
            'Validating data integrity',
            'Transferring batch 1-1000',
            'Index creation in progress',
            'Constraint validation successful'
          ];
          
          const newLog = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            level: logLevels[Math.floor(Math.random() * logLevels.length)],
            message: messages[Math.floor(Math.random() * messages.length)]
          };
          
          setLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20 logs
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, status, onMigrationComplete]);

  const pauseMigration = () => setStatus('paused');
  const resumeMigration = () => setStatus('running');
  const stopMigration = () => setStatus('stopped');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Controls */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl flex items-center">
                <Activity className="h-6 w-6 mr-3 text-green-400" />
                Live Migration Console
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time monitoring and control for PostgreSQL → MongoDB migration
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge className={`${
                status === 'running' ? 'bg-green-500/20 text-green-400 border-green-500/30 animate-pulse' :
                status === 'paused' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              
              <div className="flex space-x-2">
                {status === 'running' && (
                  <Button size="sm" variant="outline" onClick={pauseMigration} className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
                {status === 'paused' && (
                  <Button size="sm" variant="outline" onClick={resumeMigration} className="border-green-500/50 text-green-400 hover:bg-green-500/10">
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={stopMigration} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Overall Progress</div>
              <BarChart className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(progress)}%</div>
            <Progress value={progress} className="h-2 mb-2" />
            <div className="text-xs text-gray-400">Step 3 of 7: Data Transfer</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Records Processed</div>
              <Database className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{metrics.recordsProcessed.toLocaleString()}</div>
            <div className="text-xs text-gray-400">of 2.3M total records</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Transfer Rate</div>
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{metrics.transferRate.toFixed(1)}</div>
            <div className="text-xs text-gray-400">MB/sec</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">Time Remaining</div>
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">4.2h</div>
            <div className="text-xs text-gray-400">estimated</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Migration Stages</CardTitle>
            <CardDescription className="text-gray-400">Current step breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-white flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Schema Analysis
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <span className="text-white flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                Schema Conversion
              </span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Complete</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <span className="text-white flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-400 animate-pulse" />
                Data Transfer
              </span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">In Progress</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-500/10 border border-gray-500/30 rounded-lg">
              <span className="text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Index Creation
              </span>
              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-500/10 border border-gray-500/30 rounded-lg">
              <span className="text-gray-400 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Validation
              </span>
              <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Live Logs
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
            <CardDescription className="text-gray-400">Real-time migration activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-2 rounded-lg bg-white/5 border border-white/10">
                    <Badge 
                      className={`text-xs mt-0.5 ${
                        log.level === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        log.level === 'warning' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {log.level}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm">{log.message}</div>
                      <div className="text-gray-400 text-xs">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Performance Metrics</CardTitle>
          <CardDescription className="text-gray-400">Real-time system performance during migration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-white">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-white">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network I/O</span>
                <span className="text-white">38%</span>
              </div>
              <Progress value={38} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Disk Usage</span>
                <span className="text-white">23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
