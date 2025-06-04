
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  Hash,
  Shield
} from 'lucide-react'
import { useMigrationOrchestrator } from '@/hooks/useMigrationOrchestrator'

interface ValidationPanelProps {
  migrationId: string
}

interface ValidationResult {
  type: string
  isValid: boolean
  source: any
  target: any
  discrepancies: any
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ migrationId }) => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { validateMigration } = useMigrationOrchestrator()

  const validationTypes = [
    { 
      id: 'row_count', 
      name: 'Row Count Validation', 
      description: 'Compare total row counts between source and target',
      icon: Database
    },
    { 
      id: 'checksum', 
      name: 'Data Checksum', 
      description: 'Verify data integrity using checksums',
      icon: Hash
    },
    { 
      id: 'data_integrity', 
      name: 'Data Integrity', 
      description: 'Check for null values, duplicates, and constraints',
      icon: Shield
    }
  ]

  const runValidation = async (validationType: string) => {
    setIsRunning(true)
    try {
      const result = await validateMigration(migrationId, validationType)
      
      setValidationResults(prev => {
        const filtered = prev.filter(r => r.type !== validationType)
        return [...filtered, { type: validationType, ...result }]
      })
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const runAllValidations = async () => {
    setIsRunning(true)
    try {
      const results = await Promise.all(
        validationTypes.map(async (validation) => {
          const result = await validateMigration(migrationId, validation.id)
          return { type: validation.id, ...result }
        })
      )
      setValidationResults(results)
    } catch (error) {
      console.error('Validation suite failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-400" />
    ) : (
      <XCircle className="h-5 w-5 text-red-400" />
    )
  }

  const getValidationStatus = (type: string) => {
    const result = validationResults.find(r => r.type === type)
    if (!result) return null
    
    return (
      <Badge className={result.isValid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
        {result.isValid ? 'Passed' : 'Failed'}
      </Badge>
    )
  }

  return (
    <Card className="gradient-card border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Migration Validation
          </div>
          <Button 
            onClick={runAllValidations}
            disabled={isRunning}
            className="bg-white text-gray-900 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100"
          >
            Run All Checks
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {validationTypes.map((validation) => {
            const Icon = validation.icon
            const result = validationResults.find(r => r.type === validation.id)
            
            return (
              <Card key={validation.id} className="bg-black/20 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">{validation.name}</h4>
                        <p className="text-sm text-gray-300">{validation.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result && getValidationIcon(result.isValid)}
                      {getValidationStatus(validation.id)}
                    </div>
                  </div>
                  
                  {result && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Source:</span>
                          <pre className="text-white mt-1 text-xs">
                            {JSON.stringify(result.source, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span className="text-gray-400">Target:</span>
                          <pre className="text-white mt-1 text-xs">
                            {JSON.stringify(result.target, null, 2)}
                          </pre>
                        </div>
                      </div>
                      
                      {result.discrepancies && (
                        <Alert className="bg-red-500/10 border-red-500/30">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription className="text-gray-300">
                            Discrepancies found: {JSON.stringify(result.discrepancies)}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <Button 
                      onClick={() => runValidation(validation.id)}
                      disabled={isRunning}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      {isRunning ? 'Running...' : 'Run Check'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
