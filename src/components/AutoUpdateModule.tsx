
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { useToast } from "@/hooks/use-toast"
import { 
  Download, 
  RefreshCw, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Package,
  Shield,
  Zap,
  RotateCcw
} from 'lucide-react'

interface UpdateVersion {
  version: string
  releaseDate: string
  type: 'major' | 'minor' | 'patch' | 'security'
  status: 'available' | 'downloading' | 'installed' | 'failed'
  size: string
  changelog: string[]
  critical: boolean
}

export const AutoUpdateModule: React.FC = () => {
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [showChangelog, setShowChangelog] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [currentVersion] = useState('2.1.4')
  const [updates, setUpdates] = useState<UpdateVersion[]>([
    {
      version: '2.1.5',
      releaseDate: '2024-01-15',
      type: 'patch',
      status: 'available',
      size: '12.3 MB',
      changelog: [
        'Fixed memory leak in large dataset migrations',
        'Improved PostgreSQL connection pooling',
        'Enhanced error logging for debugging',
        'UI performance optimizations'
      ],
      critical: false
    },
    {
      version: '2.2.0',
      releaseDate: '2024-01-20',
      type: 'minor',
      status: 'available',
      size: '45.7 MB',
      changelog: [
        'Added support for MongoDB 7.0',
        'New field transformation engine',
        'Enhanced validation algorithms',
        'Improved batch processing performance',
        'New learning system insights dashboard'
      ],
      critical: false
    },
    {
      version: '2.1.6',
      releaseDate: '2024-01-18',
      type: 'security',
      status: 'available',
      size: '8.9 MB',
      changelog: [
        'Critical security patch for authentication',
        'Fixed SQL injection vulnerability',
        'Enhanced encryption for data in transit',
        'Updated dependencies with security fixes'
      ],
      critical: true
    }
  ])

  const { toast } = useToast()

  const checkForUpdates = async () => {
    setIsChecking(true)
    
    // Simulate checking for updates
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsChecking(false)
    
    const availableUpdates = updates.filter(u => u.status === 'available').length
    
    toast({
      title: "Update Check Complete",
      description: `${availableUpdates} updates available for download.`,
      duration: 3000,
    })
  }

  const installUpdate = async (version: string) => {
    setUpdates(prev => prev.map(update => 
      update.version === version 
        ? { ...update, status: 'downloading' as const }
        : update
    ))

    // Simulate download progress
    for (let progress = 0; progress <= 100; progress += 5) {
      setDownloadProgress(progress)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 1000))

    setUpdates(prev => prev.map(update => 
      update.version === version 
        ? { ...update, status: 'installed' as const }
        : update
    ))

    setDownloadProgress(0)

    toast({
      title: "Update Installed",
      description: `Version ${version} has been successfully installed.`,
      duration: 4000,
    })
  }

  const rollbackUpdate = async (version: string) => {
    toast({
      title: "Rolling Back Update",
      description: `Rolling back to previous version from ${version}...`,
      duration: 3000,
    })

    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 2000))

    setUpdates(prev => prev.map(update => 
      update.version === version 
        ? { ...update, status: 'available' as const }
        : update
    ))

    toast({
      title: "Rollback Complete",
      description: "System has been restored to previous version.",
      duration: 3000,
    })
  }

  const getUpdateTypeIcon = (type: UpdateVersion['type']) => {
    switch (type) {
      case 'major': return <Package className="h-4 w-4 text-purple-400" />
      case 'minor': return <Zap className="h-4 w-4 text-blue-400" />
      case 'patch': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'security': return <Shield className="h-4 w-4 text-red-400" />
    }
  }

  const getUpdateTypeBadge = (type: UpdateVersion['type'], critical: boolean) => {
    if (critical) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical</Badge>
    }
    
    switch (type) {
      case 'major': return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Major</Badge>
      case 'minor': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Minor</Badge>
      case 'patch': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Patch</Badge>
      case 'security': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Security</Badge>
    }
  }

  const getStatusBadge = (status: UpdateVersion['status']) => {
    switch (status) {
      case 'available': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Available</Badge>
      case 'downloading': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Downloading</Badge>
      case 'installed': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Installed</Badge>
      case 'failed': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Failed</Badge>
    }
  }

  // Auto-update effect
  useEffect(() => {
    if (autoUpdateEnabled) {
      const interval = setInterval(() => {
        const criticalUpdate = updates.find(u => u.critical && u.status === 'available')
        if (criticalUpdate) {
          toast({
            title: "Critical Update Available",
            description: `Security update ${criticalUpdate.version} is ready for installation.`,
            duration: 5000,
          })
        }
      }, 30000) // Check every 30 seconds for demo

      return () => clearInterval(interval)
    }
  }, [autoUpdateEnabled, updates, toast])

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Auto-Update Management
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-update" 
                checked={autoUpdateEnabled}
                onCheckedChange={setAutoUpdateEnabled}
              />
              <Label htmlFor="auto-update" className="text-white">Auto-Update</Label>
            </div>
            <Button
              onClick={checkForUpdates}
              disabled={isChecking}
              size="sm"
              className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Check Updates
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Version */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Current Version</h4>
              <p className="text-gray-400 text-sm">DBMT v{currentVersion}</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Available Updates */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">Available Updates ({updates.filter(u => u.status === 'available').length})</h4>
          
          {updates.map((update) => (
            <div key={update.version} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getUpdateTypeIcon(update.type)}
                  <div>
                    <h5 className="text-white font-medium">Version {update.version}</h5>
                    <p className="text-gray-400 text-sm">{update.releaseDate} • {update.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getUpdateTypeBadge(update.type, update.critical)}
                  {getStatusBadge(update.status)}
                </div>
              </div>

              {update.status === 'downloading' && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Downloading...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChangelog(
                    showChangelog === update.version ? null : update.version
                  )}
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto"
                >
                  {showChangelog === update.version ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Changelog
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      View Changelog
                    </>
                  )}
                </Button>

                <div className="flex space-x-2">
                  {update.status === 'installed' && (
                    <Button
                      onClick={() => rollbackUpdate(update.version)}
                      size="sm"
                      variant="outline"
                      className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Rollback
                    </Button>
                  )}
                  {update.status === 'available' && (
                    <Button
                      onClick={() => installUpdate(update.version)}
                      size="sm"
                      className={update.critical 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "bg-green-500 hover:bg-green-600 text-white"
                      }
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Install
                    </Button>
                  )}
                </div>
              </div>

              {showChangelog === update.version && (
                <div className="mt-3 p-3 bg-black/20 rounded border border-white/10">
                  <h6 className="text-white font-medium mb-2">What's New:</h6>
                  <ul className="space-y-1">
                    {update.changelog.map((item, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auto-Update Settings */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="h-5 w-5 text-blue-400" />
            <span className="text-white font-medium">Auto-Update Policy</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Security Updates:</span>
              <span className="text-green-400">Automatic (Immediate)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Critical Patches:</span>
              <span className="text-yellow-400">Automatic (Next Maintenance)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Feature Updates:</span>
              <span className="text-blue-400">Manual Approval Required</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
