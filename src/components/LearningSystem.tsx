
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Database,
  Zap,
  Target,
  BarChart,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Activity
} from 'lucide-react'

interface LearningInsight {
  id: string
  type: 'performance' | 'optimization' | 'pattern' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  migrationCount: number
  lastSeen: string
}

interface PerformanceMetric {
  name: string
  value: string
  trend: 'up' | 'down' | 'stable'
  change: string
  icon: any
}

export const LearningSystem: React.FC = () => {
  const [insights, setInsights] = useState<LearningInsight[]>([])
  const [isLearning, setIsLearning] = useState(false)

  const learningInsights: LearningInsight[] = [
    {
      id: '1',
      type: 'performance',
      title: 'Optimal Batch Size Identified',
      description: 'Batch size of 15,000 rows consistently delivers 40% better performance for PostgreSQL to MongoDB migrations',
      impact: 'high',
      confidence: 94,
      migrationCount: 12,
      lastSeen: '2 hours ago'
    },
    {
      id: '2',
      type: 'optimization',
      title: 'JSON Field Mapping Pattern',
      description: 'Automatic JSON field flattening reduces migration time by 25% for e-commerce databases',
      impact: 'medium',
      confidence: 87,
      migrationCount: 8,
      lastSeen: '1 day ago'
    },
    {
      id: '3',
      type: 'pattern',
      title: 'Index Recreation Strategy',
      description: 'Recreating indexes after migration is 60% faster than maintaining them during migration',
      impact: 'high',
      confidence: 91,
      migrationCount: 15,
      lastSeen: '3 hours ago'
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Parallel Processing Sweet Spot',
      description: '4 parallel threads optimal for tables with 100K+ rows on current hardware configuration',
      impact: 'medium',
      confidence: 82,
      migrationCount: 6,
      lastSeen: '5 hours ago'
    },
    {
      id: '5',
      type: 'optimization',
      title: 'Data Type Conversion Efficiency',
      description: 'Pre-converting ENUM to TEXT before migration reduces error rate by 75%',
      impact: 'high',
      confidence: 96,
      migrationCount: 18,
      lastSeen: '30 minutes ago'
    }
  ]

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: 'Avg Migration Speed',
      value: '2.4M rows/hour',
      trend: 'up',
      change: '+18%',
      icon: TrendingUp
    },
    {
      name: 'Success Rate',
      value: '97.8%',
      trend: 'up',
      change: '+2.1%',
      icon: Target
    },
    {
      name: 'Error Recovery Time',
      value: '3.2 minutes',
      trend: 'down',
      change: '-45%',
      icon: Clock
    },
    {
      name: 'Data Integrity Score',
      value: '99.9%',
      trend: 'stable',
      change: '0%',
      icon: CheckCircle
    }
  ]

  useEffect(() => {
    // Simulate learning new insights over time
    const interval = setInterval(() => {
      if (insights.length < learningInsights.length) {
        setInsights(prev => [...prev, learningInsights[prev.length]])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [insights.length])

  const runLearningAnalysis = () => {
    setIsLearning(true)
    setTimeout(() => {
      setInsights(learningInsights)
      setIsLearning(false)
    }, 2000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />
      case 'optimization': return <Zap className="h-4 w-4" />
      case 'pattern': return <BarChart className="h-4 w-4" />
      case 'recommendation': return <Lightbulb className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
      default: return ''
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <Brain className="h-6 w-6 mr-3" />
                AI Learning & Performance Optimization
              </CardTitle>
              <CardDescription className="text-gray-400">
                Intelligent insights from migration history and performance patterns
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Activity className="h-3 w-3 mr-1" />
                Learning Active
              </Badge>
              <Button 
                onClick={runLearningAnalysis}
                disabled={isLearning}
                size="sm"
                className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
              >
                {isLearning ? 'Analyzing...' : 'Refresh Insights'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="insights" className="data-[state=active]:bg-white/20 text-white">
            <Lightbulb className="h-4 w-4 mr-2" />
            Smart Insights
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white/20 text-white">
            <BarChart className="h-4 w-4 mr-2" />
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20 text-white">
            <Award className="h-4 w-4 mr-2" />
            Best Practices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">Learning in Progress</h3>
                <p className="text-gray-400 mb-4">AI is analyzing migration patterns to generate insights</p>
                <Button onClick={runLearningAnalysis} disabled={isLearning}>
                  {isLearning ? 'Analyzing...' : 'Start Analysis'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(insight.type)}
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">{insight.confidence}%</div>
                        <div className="text-gray-400 text-xs">confidence</div>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">{insight.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Based on {insight.migrationCount} migrations</span>
                      <span>{insight.lastSeen}</span>
                    </div>
                    <Progress value={insight.confidence} className="h-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric) => {
              const Icon = metric.icon
              return (
                <Card key={metric.name} className="bg-white/5 border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-8 w-8 text-blue-400" />
                      <span className="text-2xl">{getTrendIcon(metric.trend)}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-sm text-gray-400 mb-2">{metric.name}</div>
                    <div className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-400' : 
                      metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {metric.change} from last week
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Performance Improvement</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Migration speed has improved by 18% over the last month due to optimized batch processing and learned patterns.
                  </p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-5 w-5 text-blue-400" />
                    <span className="text-blue-400 font-medium">Accuracy Enhancement</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Success rate increased by 2.1% through improved error handling and data validation techniques.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Recommended Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400 font-medium text-sm">✓ Use 15K row batches</div>
                  <div className="text-gray-300 text-xs">Optimal for most database types</div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400 font-medium text-sm">✓ Enable parallel processing</div>
                  <div className="text-gray-300 text-xs">For tables with 100K+ rows</div>
                </div>
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded">
                  <div className="text-green-400 font-medium text-sm">✓ Recreate indexes post-migration</div>
                  <div className="text-gray-300 text-xs">60% faster than maintaining during migration</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Common Pitfalls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="text-yellow-400 font-medium text-sm">⚠ Large transaction sizes</div>
                  <div className="text-gray-300 text-xs">Can cause timeout and rollback issues</div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="text-yellow-400 font-medium text-sm">⚠ Ignoring data type differences</div>
                  <div className="text-gray-300 text-xs">Lead to 40% of migration failures</div>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <div className="text-yellow-400 font-medium text-sm">⚠ Skipping validation</div>
                  <div className="text-gray-300 text-xs">Results in data integrity issues</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
