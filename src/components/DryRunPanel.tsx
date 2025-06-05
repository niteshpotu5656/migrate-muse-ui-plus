
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from "@/hooks/use-toast"
import { 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  XCircle,
  Target,
  Database,
  Loader2
} from 'lucide-react'

interface DryRunPanelProps {
  migrationConfig: any
  onProceedToActualMigration: () => void
}

interface DryRunResult {
  complexityScore: number
  estimatedTime: string
  recommendations: string[]
  fieldMismatches: Array<{
    table: string
    source: string
    target: string
    issue: string
  }>
  summaryLogs: string[]
}

export const DryRunPanel: React.FC<DryRunPanelProps> = ({ 
  migrationConfig, 
  onProceedToActualMigration 
}) => {
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const runDryRun = async () => {
    setIsRunning(true)
    setProgress(0)
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate mock results
    const mockResult: DryRunResult = {
      complexityScore: Math.floor(Math.random() * 40) + 30, // 30-70 range
      estimatedTime: `${Math.floor(Math.random() * 8) + 2} minutes ${Math.floor(Math.random() * 60)} seconds`,
      recommendations: [
        "Consider increasing batch size to 15,000 rows for better performance",
        "Enable parallel processing for tables larger than 50,000 rows",
        "Review JSON field mappings for potential data loss",
        "Add indexes on foreign key columns before migration"
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      fieldMismatches: [
        { table: "users", source: "created_at (DATETIME)", target: "created_timestamp (TIMESTAMP)", issue: "Type conversion required" },
        { table: "orders", source: "status (ENUM)", target: "order_status (TEXT)", issue: "Enum values need mapping" },
        { table: "products", source: "metadata (JSON)", target: "product_data (JSONB)", issue: "JSON format migration" }
      ],
      summaryLogs: [
        "✓ Source database connection verified",
        "✓ Target database schema analyzed",
        "⚠ 3 field type mismatches detected",
        "✓ Foreign key relationships mapped",
        "✓ Index requirements calculated",
        "⚠ Performance optimization suggestions generated"
      ]
    }
    
    setDryRunResult(mockResult)
    setIsRunning(false)
    clearInterval(progressInterval)
    setProgress(100)

    toast({
      title: "Dry Run Complete",
      description: `Migration complexity: ${mockResult.complexityScore}%. Review recommendations before proceeding.`,
      duration: 5000,
    })
  }

  const getComplexityColor = (score: number) => {
    if (score < 40) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score < 70) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const getComplexityLabel = (score: number) => {
    if (score < 40) return 'Low Risk'
    if (score < 70) return 'Medium Risk'
    return 'High Risk'
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Shield className="h-5 w-5 mr-2" />
          Dry Run Analysis & Migration Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!dryRunResult && !isRunning && (
          <div className="text-center py-8">
            <div className="mb-6">
              <Target className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready for Dry Run Analysis
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Analyze migration complexity, detect potential issues, and get optimization recommendations before executing the actual migration.
              </p>
            </div>
            <Button 
              onClick={runDryRun}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Dry Run Analysis
            </Button>
          </div>
        )}

        {isRunning && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-white mb-2">Analyzing Migration</h3>
              <p className="text-gray-300 mb-4">Evaluating schema compatibility and performance factors...</p>
              <div className="max-w-md mx-auto">
                <Progress value={progress} className="h-3 mb-2" />
                <p className="text-sm text-gray-400">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </div>
        )}

        {dryRunResult && (
          <div className="space-y-6">
            {/* Complexity Score & Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">
                    {dryRunResult.complexityScore}%
                  </div>
                  <Badge className={getComplexityColor(dryRunResult.complexityScore)}>
                    {getComplexityLabel(dryRunResult.complexityScore)}
                  </Badge>
                  <p className="text-gray-300 text-sm mt-2">Migration Complexity</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <Clock className="h-10 w-10 text-green-400 mx-auto mb-3" />
                  <div className="text-xl font-bold text-white mb-2">
                    {dryRunResult.estimatedTime}
                  </div>
                  <p className="text-gray-300 text-sm">Estimated Duration</p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 text-center">
                  <Database className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                  <div className="text-xl font-bold text-white mb-2">
                    {dryRunResult.fieldMismatches.length}
                  </div>
                  <p className="text-gray-300 text-sm">Field Mismatches</p>
                </CardContent>
              </Card>
            </div>

            {/* Field Mismatches */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Field Type Mismatches Detected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dryRunResult.fieldMismatches.map((mismatch, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {mismatch.table}
                      </Badge>
                      <span className="text-yellow-400 text-sm">{mismatch.issue}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <span className="text-white">{mismatch.source}</span> → <span className="text-white">{mismatch.target}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dryRunResult.recommendations.map((rec, index) => (
                  <Alert key={index} className="bg-blue-500/10 border-blue-500/30">
                    <AlertDescription className="text-gray-300">
                      {rec}
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            {/* Summary Logs */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  {dryRunResult.summaryLogs.map((log, index) => (
                    <div key={index} className="text-gray-300">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={runDryRun}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Re-run Analysis
              </Button>
              <Button 
                onClick={onProceedToActualMigration}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Proceed with Migration
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
