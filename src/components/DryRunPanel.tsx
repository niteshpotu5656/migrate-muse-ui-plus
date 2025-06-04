
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield
} from 'lucide-react'
import { useMigrationOrchestrator, type MigrationRequest, type DryRunResult } from '@/hooks/useMigrationOrchestrator'

interface DryRunPanelProps {
  migrationConfig: MigrationRequest
  onProceedToActualMigration: () => void
}

export const DryRunPanel: React.FC<DryRunPanelProps> = ({ 
  migrationConfig, 
  onProceedToActualMigration 
}) => {
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const { startMigration, isLoading } = useMigrationOrchestrator()

  const runDryRun = async () => {
    setIsRunning(true)
    try {
      const result = await startMigration({
        ...migrationConfig,
        options: { ...migrationConfig.options, dryRun: true }
      }) as DryRunResult
      
      setDryRunResult(result)
    } catch (error) {
      console.error('Dry run failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getComplexityColor = (score: number) => {
    if (score < 30) return 'bg-green-500'
    if (score < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getComplexityLabel = (score: number) => {
    if (score < 30) return 'Low Risk'
    if (score < 70) return 'Medium Risk'
    return 'High Risk'
  }

  return (
    <Card className="gradient-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Play className="h-5 w-5 mr-2" />
          Dry Run Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!dryRunResult && !isRunning && (
          <div className="text-center py-8">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Run Simulation First
              </h3>
              <p className="text-gray-300 mb-6">
                Analyze your migration complexity and get recommendations before executing.
              </p>
            </div>
            <Button 
              onClick={runDryRun}
              disabled={isLoading}
              className="bg-white text-gray-900 font-semibold px-6 py-2 rounded shadow hover:bg-gray-100"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Dry Run
            </Button>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Migration</h3>
            <p className="text-gray-300">Calculating complexity and generating recommendations...</p>
          </div>
        )}

        {dryRunResult && (
          <div className="space-y-6">
            {/* Complexity Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {dryRunResult.complexityScore}%
                  </div>
                  <Badge className={`${getComplexityColor(dryRunResult.complexityScore)} text-white`}>
                    {getComplexityLabel(dryRunResult.complexityScore)}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {dryRunResult.estimatedTime}
                  </div>
                  <p className="text-gray-300 text-sm">Estimated Duration</p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">
                    {dryRunResult.recommendations.length}
                  </div>
                  <p className="text-gray-300 text-sm">Recommendations</p>
                </CardContent>
              </Card>
            </div>

            {/* Complexity Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Migration Complexity</span>
                <span>{dryRunResult.complexityScore}%</span>
              </div>
              <Progress 
                value={dryRunResult.complexityScore} 
                className="h-3"
              />
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {dryRunResult.recommendations.map((rec, index) => (
                  <Alert key={index} className="bg-yellow-500/10 border-yellow-500/30">
                    <AlertDescription className="text-gray-300">
                      {rec}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={runDryRun}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Re-run Analysis
              </Button>
              <Button 
                onClick={onProceedToActualMigration}
                className="bg-white text-gray-900 font-semibold px-6 py-2 rounded shadow hover:bg-gray-100 flex-1"
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
