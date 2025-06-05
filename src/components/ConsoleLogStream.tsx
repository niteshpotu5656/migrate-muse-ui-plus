
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface ConsoleLogStreamProps {
  isActive: boolean;
  migrationId?: string;
}

export const ConsoleLogStream: React.FC<ConsoleLogStreamProps> = ({ 
  isActive, 
  migrationId 
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Mock log messages for simulation
  const mockLogMessages = [
    { level: 'info' as const, message: '🚀 Initializing database migration service...', details: 'DBMT v2.1.0' },
    { level: 'info' as const, message: '🔌 Connecting to source database (PostgreSQL)...', details: 'Host: localhost:5432' },
    { level: 'success' as const, message: '✅ Source database connection established', details: 'Connection pool: 10 active' },
    { level: 'info' as const, message: '🔌 Connecting to target database (MongoDB)...', details: 'Host: localhost:27017' },
    { level: 'success' as const, message: '✅ Target database connection established', details: 'Database: migration_target' },
    { level: 'info' as const, message: '🔍 Analyzing source schema...', details: 'Tables found: 12' },
    { level: 'info' as const, message: '🗺️ Validating field mappings...', details: 'Mappings: 47 configured' },
    { level: 'success' as const, message: '✅ Schema analysis complete', details: 'Complexity score: 6.8/10' },
    { level: 'info' as const, message: '📦 Starting migration batch 1/4...', details: 'Table: users (5,234 rows)' },
    { level: 'info' as const, message: '⚡ Migrating table: users', details: 'Progress: 1,000/5,234 rows (19%)' },
    { level: 'info' as const, message: '⚡ Migrating table: users', details: 'Progress: 2,500/5,234 rows (48%)' },
    { level: 'info' as const, message: '⚡ Migrating table: users', details: 'Progress: 4,000/5,234 rows (76%)' },
    { level: 'success' as const, message: '✅ Table migration complete: users', details: '5,234 rows migrated successfully' },
    { level: 'info' as const, message: '📦 Starting migration batch 2/4...', details: 'Table: orders (12,847 rows)' },
    { level: 'info' as const, message: '⚡ Migrating table: orders', details: 'Progress: 3,000/12,847 rows (23%)' },
    { level: 'warning' as const, message: '⚠️ Data type conversion required', details: 'VARCHAR to ObjectId for field: user_id' },
    { level: 'info' as const, message: '⚡ Migrating table: orders', details: 'Progress: 7,500/12,847 rows (58%)' },
    { level: 'info' as const, message: '⚡ Migrating table: orders', details: 'Progress: 11,200/12,847 rows (87%)' },
    { level: 'success' as const, message: '✅ Table migration complete: orders', details: '12,847 rows migrated successfully' },
    { level: 'info' as const, message: '🔍 Running data validation checks...', details: 'Validating row counts and integrity' },
    { level: 'success' as const, message: '✅ Row count validation passed', details: 'Source: 18,081 | Target: 18,081' },
    { level: 'success' as const, message: '✅ Data integrity validation passed', details: 'Checksum verification complete' },
    { level: 'success' as const, message: '🎉 Migration completed successfully!', details: 'Total time: 4m 32s | All 18,081 records migrated' }
  ];

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      if (logs.length < mockLogMessages.length) {
        const nextLog = mockLogMessages[logs.length];
        const newLog: LogEntry = {
          id: `log_${Date.now()}_${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          ...nextLog
        };
        
        setLogs(prev => [...prev, newLog]);
      }
    }, 1500 + Math.random() * 1000); // Random interval between 1.5-2.5 seconds

    return () => clearInterval(interval);
  }, [isActive, isPaused, logs.length, mockLogMessages.length]);

  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.details ? ` | ${log.details}` : ''}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-logs-${migrationId || 'unknown'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Terminal className="h-5 w-5 mr-2" />
            📶 Live Console
            {isActive && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 ml-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Active
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPaused(!isPaused)}
              className="border-white/20 text-gray-800 hover:bg-white/10"
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={clearLogs}
              className="border-white/20 text-gray-800 hover:bg-white/10"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportLogs}
              disabled={logs.length === 0}
              className="border-white/20 text-gray-800 hover:bg-white/10"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div 
          ref={logContainerRef}
          className="flex-1 bg-black/40 rounded-lg p-4 font-mono text-sm overflow-y-auto space-y-2 border border-white/10"
          style={{ maxHeight: '400px' }}
        >
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              <Terminal className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>📺 Console output will appear here when migration starts</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start space-x-3 animate-fade-in">
                <span className="text-gray-500 text-xs mt-1 min-w-[80px]">
                  {log.timestamp}
                </span>
                <div className="mt-0.5">
                  {getLogIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`${getLogColor(log.level)} break-words`}>
                    {log.message}
                  </div>
                  {log.details && (
                    <div className="text-gray-400 text-xs mt-1 break-words">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
          <span>📊 {logs.length} log entries</span>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-500"
            />
            <span>Auto-scroll</span>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
