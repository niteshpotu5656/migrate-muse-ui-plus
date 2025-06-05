
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from "@/hooks/use-toast"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Database,
  Hash,
  Key,
  BarChart,
  Play,
  RefreshCw,
  Loader2
} from 'lucide-react'

interface ValidationPanelProps {
  migrationId: string
}

interface ValidationCheck {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning'
  icon: any
  result?: {
    expected: string | number
    actual: string | number
    details?: string
  }
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ migrationId }) => {
  const [checks, setChecks] = useState<ValidationCheck[]>([
    {
      id: 'row_count',
      name: 'Row Count Validation',
      description: 'Verify all rows were migrated correctly',
      status: 'pending',
      icon: BarChart
    },
    {
      id: 'data_checksum',
      name: 'Data Checksum',
      description: 'Validate data integrity using checksums',
      status: 'pending',
      icon: Hash
    },
    {
      id: 'foreign_keys',
      name: 'Foreign Key Integrity',
      description: 'Check referential integrity constraints',
      status: 'pending',
      icon: Key
    },
    {
      id: 'unique_constraints',
      name: 'Unique Constraints',
      description: 'Validate unique field constraints',
      status: 'pending',
      icon: Database
    }
  ])
  
  const [isRunning, setIsRunning] = useState(false)
  const [currentCheck, setCurrentCheck] = useState<string | null>(null)
  const { toast } = useToast()

  const runAllChecks = async () => {
    setIsRunning(true)
    
    for (let i = 0; i < checks.length; i++) {
      const check = checks[i]
      setCurrentCheck(check.id)
      
      // Update check to running
      setChecks(prev => prev.map(c => 
        c.id === check.id ? { ...c, status: 'running' as const } : c
      ))
      
      // Simulate check duration
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate mock results
      const mockResults = generateMockResult(check.id)
      
      setChecks(prev => prev.map(c => 
        c.id === check.id ? { ...c, ...mockResults } : c
      ))
    }
    
    setCurrentCheck(null)
    setIsRunning(false)
    
    const failedChecks = checks.filter(c => c.status === 'failed').length
    const warningChecks = checks.filter(c => c.status === 'warning').length
    
    if (failedChecks > 0) {
      toast({
        title: "Validation Issues Found",
        description: `${failedChecks} checks failed, ${warningChecks} warnings detected.`,
        variant: "destructive",
        duration: 5000,
      })
    } else {
      toast({
        title: "Validation Complete",
        description: "All integrity checks passed successfully!",
        duration: 5000,
      })
    }
  }

  const runSingleCheck = async (checkId: string) => {
    setCurrentCheck(checkId)
    
    setChecks(prev => prev.map(c => 
      c.id === checkId ? { ...c, status: 'running' as const } : c
    ))
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResults = generateMockResult(checkId)
    
    setChecks(prev => prev.map(c => 
      c.id === checkId ? { ...c, ...mockResults } : c
    ))
    
    setCurrentCheck(null)
  }

  const generateMockResult = (checkId: string) => {
    const rand = Math.random()
    
    switch (checkId) {
      case 'row_count':
        if (rand > 0.8) {
          return {
            status: 'failed' as const,
            result: {
              expected: 15420,
              actual: 15418,
              details: '2 rows missing in target database'
            }
          }
        } else if (rand > 0.6) {
          return {
            status: 'warning' as const,
            result: {
              expected: 15420,
              actual: 15420,
              details: 'Row counts match but some empty rows detected'
            }
          }
        }
        return {
          status: 'passed' as const,
          result: {
            expected: 15420,
            actual: 15420,
            details: 'All rows migrated successfully'
          }
        }
      
      case 'data_checksum':
        if (rand > 0.85) {
          return {
            status: 'failed' as const,
            result: {
              expected: 'SHA256:a1b2c3d4',
              actual: 'SHA256:a1b2c3d5',
              details: 'Data corruption detected in products table'
            }
          }
        }
        return {
          status: 'passed' as const,
          result: {
            expected: 'SHA256:a1b2c3d4',
            actual: 'SHA256:a1b2c3d4',
            details: 'Data integrity verified across all tables'
          }
        }
      
      case 'foreign_keys':
        if (rand > 0.9) {
          return {
            status: 'failed' as const,
            result: {
              expected: '0 violations',
              actual: '3 violations',
              details: 'Orphaned records found in orders table'
            }
          }
        } else if (rand > 0.7) {
          return {
            status: 'warning' as const,
            result: {
              expected: '0 violations',
              actual: '0 violations',
              details: 'Some FK constraints were modified during migration'
            }
          }
        }
        return {
          status: 'passed' as const,
          result: {
            expected: '0 violations',
            actual: '0 violations',
            details: 'All foreign key relationships maintained'
          }
        }
      
      case 'unique_constraints':
        if (rand > 0.85) {
          return {
            status: 'failed' as const,
            result: {
              expected: '0 duplicates',
              actual: '2 duplicates',
              details: 'Duplicate email addresses found'
            }
          }
        }
        return {
          status: 'passed' as const,
          result: {
            expected: '0 duplicates',
            actual: '0 duplicates',
            details: 'All unique constraints satisfied'
          }
        }
      
      default:
        return { status: 'passed' as const }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'failed': return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case 'running': return <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Passed</Badge>
      case 'failed': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
      case 'warning': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Warning</Badge>
      case 'running': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Running</Badge>
      default: return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Pending</Badge>
    }
  }

  const passedChecks = checks.filter(c => c.status === 'passed').length
  const totalChecks = checks.length
  const completedChecks = checks.filter(c => c.status !== 'pending').length

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Validation & Integrity Checks
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {completedChecks}/{totalChecks} Complete
            </Badge>
            <Button
              onClick={runAllChecks}
              disabled={isRunning}
              size="sm"
              className="bg-white text-gray-900 font-semibold hover:bg-gray-100"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Checks
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Validation Progress</span>
            <span>{Math.round((completedChecks / totalChecks) * 100)}%</span>
          </div>
          <Progress value={(completedChecks / totalChecks) * 100} className="h-2" />
        </div>

        {/* Individual Checks */}
        <div className="space-y-4">
          {checks.map((check) => {
            const Icon = check.icon
            return (
              <div key={check.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-blue-400" />
                    <div>
                      <h4 className="text-white font-medium">{check.name}</h4>
                      <p className="text-gray-400 text-sm">{check.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    {getStatusBadge(check.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runSingleCheck(check.id)}
                      disabled={isRunning || check.status === 'running'}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {check.result && (
                  <div className="mt-3 p-3 bg-black/20 rounded border border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Expected:</span>
                        <div className="text-white font-mono">{check.result.expected}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Actual:</span>
                        <div className="text-white font-mono">{check.result.actual}</div>
                      </div>
                    </div>
                    {check.result.details && (
                      <div className="mt-2 text-sm text-gray-300">
                        {check.result.details}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Summary */}
        {completedChecks > 0 && (
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-2">Validation Summary</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{checks.filter(c => c.status === 'passed').length}</div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{checks.filter(c => c.status === 'warning').length}</div>
                <div className="text-sm text-gray-400">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{checks.filter(c => c.status === 'failed').length}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
