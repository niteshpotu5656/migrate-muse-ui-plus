
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  AlertTriangle,
  CheckCircle,
  BarChart,
  Lightbulb,
  Database,
  Zap
} from 'lucide-react';

interface LearningSystemProps {
  migrationHistory?: any[];
}

export const LearningSystem: React.FC<LearningSystemProps> = ({ migrationHistory = [] }) => {
  const [activeInsight, setActiveInsight] = useState(0);

  const performanceInsights = [
    {
      type: 'optimization',
      title: 'Batch Size Optimization',
      description: 'Based on your PostgreSQL → MongoDB migrations, reducing batch size to 5,000 records improved performance by 23%',
      impact: 'High',
      confidence: 94,
      recommendation: 'Use smaller batch sizes for cross-platform migrations'
    },
    {
      type: 'warning',
      title: 'Schema Complexity Alert',
      description: 'Migrations with 15+ foreign key relationships show 67% higher failure rate',
      impact: 'Medium',
      confidence: 89,
      recommendation: 'Consider pre-migration schema simplification'
    },
    {
      type: 'success',
      title: 'SSL Configuration Pattern',
      description: 'Enabling SSL encryption adds only 3% overhead but improves security compliance score',
      impact: 'Low',
      confidence: 98,
      recommendation: 'Always enable SSL for production migrations'
    }
  ];

  const migrationPatterns = [
    { source: 'PostgreSQL', target: 'MongoDB', count: 12, avgDuration: '4.2h', successRate: 96 },
    { source: 'MySQL', target: 'PostgreSQL', count: 8, avgDuration: '2.1h', successRate: 100 },
    { source: 'MongoDB', target: 'Elasticsearch', count: 5, avgDuration: '6.7h', successRate: 80 },
    { source: 'Oracle', target: 'PostgreSQL', count: 3, avgDuration: '12.3h', successRate: 67 }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Medium': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Brain className="h-6 w-6 mr-3" />
            Learning System & Performance Intelligence
          </CardTitle>
          <CardDescription className="text-gray-400">
            AI-powered insights from {migrationHistory.length || 28} completed migrations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-xl border border-white/10">
          <TabsTrigger value="insights" className="data-[state=active]:bg-white/20 text-white">
            <Lightbulb className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20 text-white">
            <BarChart className="h-4 w-4 mr-2" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-white/20 text-white">
            <Target className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performanceInsights.map((insight, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      {insight.type === 'optimization' && <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />}
                      {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />}
                      {insight.type === 'success' && <CheckCircle className="h-5 w-5 mr-2 text-green-400" />}
                      {insight.title}
                    </CardTitle>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm">{insight.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Confidence Level</span>
                      <span className="text-white">{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm font-medium">Recommendation:</p>
                    <p className="text-blue-200 text-sm">{insight.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Migration Patterns Tab */}
        <TabsContent value="patterns" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Migration Pattern Analysis</CardTitle>
              <CardDescription className="text-gray-400">
                Historical performance data across different database combinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {migrationPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-4">
                      <Database className="h-5 w-5 text-blue-400" />
                      <div>
                        <div className="text-white font-medium">
                          {pattern.source} → {pattern.target}
                        </div>
                        <div className="text-sm text-gray-400">
                          {pattern.count} migrations completed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-white font-medium">{pattern.avgDuration}</div>
                        <div className="text-xs text-gray-400">Avg Duration</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${pattern.successRate >= 95 ? 'text-green-400' : pattern.successRate >= 80 ? 'text-orange-400' : 'text-red-400'}`}>
                          {pattern.successRate}%
                        </div>
                        <div className="text-xs text-gray-400">Success Rate</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Performance Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <span className="text-green-300">Enable parallel processing</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+34% faster</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-blue-300">Optimize batch size</span>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">+23% faster</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <span className="text-purple-300">Use connection pooling</span>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">+18% faster</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  Predicted Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated time reduction</span>
                    <span className="text-green-400">2.3 hours</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Success rate improvement</span>
                    <span className="text-green-400">+12%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Resource efficiency</span>
                    <span className="text-green-400">+28%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
