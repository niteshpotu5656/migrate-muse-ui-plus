
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConsoleLogStream } from './ConsoleLogStream'
import { ComplexityIndicator } from './ComplexityIndicator'
import { useToast } from "@/hooks/use-toast"
import { 
  Database, 
  BarChart, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Target,
  Activity
} from 'lucide-react'

interface MigrationConsoleProps {
  isActive: boolean
  onMigrationComplete: () => void
}

interface MigrationStats {
  totalTables: number
  completedTables: number
  totalRows: number
  migratedRows: number
  currentTable: string
  startTime: string
  estimatedCompletion: string
  speed: string
}

export const MigrationConsole: React.FC<MigrationConsoleProps> = ({ 
  isActive, 
  onMigrationComplete 
}) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed' | 'error'>('idle')
  const [stats, setStats] = useState<MigrationStats>({
    totalTables: 8,
    completedTables: 0,
    totalRows: 245890,
    migratedRows: 0,
    currentTable: '',
    startTime: '',
    estimatedCompletion: '',
    speed: '0 rows/sec'
  })
  const [complexityScore] = useState(67)
  const { toast } = useToast()

  useEffect(() => {
    if (isActive && status === 'idle') {
      setStatus('running')
      setStats(prev => ({
        ...prev,
        startTime: new Date().toLocaleTimeString(),
        currentTable: 'users'
      }))
    }
  }, [isActive, status])

  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 3, 100)
          
          // Update stats based on progress
          const completedTables = Math.floor((newProgress / 100) * stats.totalTables)
          const migratedRows = Math.floor((newProgress / 100) * stats.totalRows)
          const speed = Math.floor(Math.random() * 5000) + 1000
          
          const tableNames = ['users', 'orders', 'products', 'categories', 'reviews', 'payments', 'shipping', 'analytics']
          const currentTableIndex = Math.floor((newProgress / 100) * tableNames.length)
          
          setStats(prev => ({
            ...prev,
            completedTables,
            migratedRows,
            currentTable: tableNames[currentTableIndex] || tableNames[tableNames.length - 1],
            speed: `${speed.toLocaleString()} rows/sec`,
            estimatedCompletion: new Date(Date.now() + (100 - newProgress) * 60000).toLocaleTimeString()
          }))

          if (newProgress >= 100) {
            setStatus('completed')
            onMigrationComplete()
            toast({
              title: "Migration Complete!",
              description: "All data has been successfully migrated.",
              duration: 5000,
            })
          }
          
          return newProgress
        })
      }, 1000 + Math.random() * 2000)

      return () => clearInterval(interval)
    }
  }, [status, stats.totalTables, stats.totalRows, onMigrationComplete, toast])

  const pauseMigration = () => {
    setStatus('paused')
    toast({
      title: "Migration Paused",
      description: "Migration has been paused. You can resume anytime.",
      duration: 3000,
    })
  }

  const resumeMigration = () => {
    setStatus('running')
    toast({
      title: "Migration Resumed",
      description: "Continuing with data migration...",
      duration: 3000,
    })
  }

  const stopMigration = () => {
    setStatus('idle')
    setProgress(0)
    setStats(prev => ({
      ...prev,
      completedTables: 0,
      migratedRows: 0,
      currentTable: '',
      startTime: '',
      estimatedCompletion: '',
      speed: '0 rows/sec'
    }))
    toast({
      title: "Migration Stopped",
      description: "Migration has been stopped and reset.",
      duration: 3000,
    })
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Activity className="w-3 h-3 mr-1 animate-pulse" />
            Running
          </Badge>
        )
      case 'paused':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            <Pause className="w-3 h-3 mr-1" />
            Paused
          </Badge>
        )
      case 'completed':
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case 'error':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Idle
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Console */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Migration Control Center
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time migration monitoring and control
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <div className="flex space-x-1">
                {status === 'running' && (
                  <Button
                    onClick={pauseMigration}
                    size="sm"
                    variant="outline"
                    className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Pause className="h-3 w-3" />
                  </Button>
                )}
                {status === 'paused' && (
                  <Button
                    onClick={resumeMigration}
                    size="sm"
                    variant="outline"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                )}
                {(status === 'running' || status === 'paused') && (
                  <Button
                    onClick={stopMigration}
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Overall Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            
            {status !== 'idle' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{stats.completedTables}/{stats.totalTables}</div>
                  <div className="text-xs text-gray-400">Tables</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{stats.migratedRows.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Rows Migrated</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{stats.speed}</div>
                  <div className="text-xs text-gray-400">Current Speed</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg font-bold text-white">{stats.estimatedCompletion}</div>
                  <div className="text-xs text-gray-400">Est. Completion</div>
                </div>
              </div>
            )}
            
            {stats.currentTable && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Currently migrating:</span>
                  <span className="text-white font-semibold">{stats.currentTable}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="logs" className="data-[state=active]:bg-white/20 text-white">
            <BarChart className="h-4 w-4 mr-2" />
            Live Logs
          </TabsTrigger>
          <TabsTrigger value="complexity" className="data-[state=active]:bg-white/20 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Complexity
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:bg-white/20 text-white">
            <Activity className="h-4 w-4 mr-2" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <ConsoleLogStream isActive={isActive} migrationId="current" />
        </TabsContent>

        <TabsContent value="complexity">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Migration Complexity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplexityIndicator score={complexityScore} showDetails={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Duration</span>
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {stats.startTime ? new Date(Date.now() - new Date(`2024-01-01 ${stats.startTime}`).getTime()).toISOString().substr(11, 8) : '00:00:00'}
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-green-400" />
                    <span className="text-white font-medium">Throughput</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats.speed}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
