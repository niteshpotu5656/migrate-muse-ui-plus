
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from "@/hooks/use-toast"
import { 
  Download, 
  Check, 
  AlertTriangle, 
  Clock, 
  GitBranch,
  Shield,
  Zap,
  History,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface UpdateVersion {
  version: string
  type: 'major' | 'minor' | 'patch' | 'security'
  releaseDate: string
  status: 'available' | 'installed' | 'downloading' | 'failed'
  changelog: string[]
  size: string
  critical: boolean
}

export const AutoUpdateModule: React.FC = () => {
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true)
  const [securityUpdatesOnly, setSecurityUpdatesOnly] = useState(false)
  const [currentVersion] = useState('2.1.4')
  const [isChecking, setIsChecking] = useState(false)
  const [lastCheck, setLastCheck] = useState('2 hours ago')
  const { toast } = useToast()

  const [availableUpdates, setAvailableUpdates] = useState<UpdateVersion[]>([
    {
      version: '2.2.0',
      type: 'minor',
      releaseDate: '2024-01-15',
      status: 'available',
      changelog: [
        'Enhanced field mapping with AI suggestions',
        'Improved PostgreSQL to MongoDB conversion',
        'New real-time progress tracking',
        'Better error handling and recovery'
      ],
      size: '45.2 MB',
      critical: false
    },
    {
      version: '2.1.5',
      type: 'security',
      releaseDate: '2024-01-10',
      status: 'available',
      changelog: [
        'Security patch for database connection vulnerabilities',
        'Fixed potential SQL injection in custom queries',
        'Updated encryption algorithms'
      ],
      size: '12.8 MB',
      critical: true
    }
  ])

  const [updateHistory] = useState([
    {
      version: '2.1.4',
      installDate: '2024-01-05',
      status: 'success',
      duration: '3m 45s'
    },
    {
      version: '2.1.3',
      installDate: '2023-12-22',
      status: 'success',
      duration: '2m 12s'
    },
    {
      version: '2.1.2',
      installDate: '2023-12-15',
      status: 'rollback',
      duration: '5m 30s'
    }
  ])

  const checkForUpdates = async () => {
    setIsChecking(true)
    
    // Simulate checking for updates
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsChecking(false)
    setLastCheck('Just now')
    
    toast({
      title: "Updates Check Complete",
      description: `Found ${availableUpdates.length} available updates`,
      duration: 3000,
    })
  }

  const installUpdate = async (version: string) => {
    const updateIndex = availableUpdates.findIndex(u => u.version === version)
    if (updateIndex === -1) return

    // Update status to downloading
    setAvailableUpdates(prev => prev.map(u => 
      u.version === version ? { ...u, status: 'downloading' as const } : u
    ))

    toast({
      title: "Download Started",
      description: `Downloading DBMT v${version}...`,
      duration: 3000,
    })

    // Simulate download and install
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Update status to installed
    setAvailableUpdates(prev => prev.map(u => 
      u.version === version ? { ...u, status: 'installed' as const } : u
    ))

    toast({
      title: "Update Installed Successfully",
      description: `DBMT v${version} has been installed and is ready to use.`,
      duration: 5000,
    })
  }

  const rollbackVersion = () => {
    toast({
      title: "Rollback Initiated",
      description: "Rolling back to previous stable version...",
      duration: 3000,
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'patch': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'security': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Download className="h-4 w-4 text-blue-400" />
      case 'installed': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'downloading': return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />
      default: return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Settings */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <Download className="h-6 w-6 mr-3" />
                Auto-Update Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Keep DBMT updated with the latest features and security patches
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">Current Version</div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                v{currentVersion}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Update Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Automatic Updates</Label>
                  <p className="text-sm text-gray-400">Install updates automatically</p>
                </div>
                <Switch 
                  checked={autoUpdateEnabled}
                  onCheckedChange={setAutoUpdateEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Security Updates Only</Label>
                  <p className="text-sm text-gray-400">Auto-install security patches only</p>
                </div>
                <Switch 
                  checked={securityUpdatesOnly}
                  onCheckedChange={setSecurityUpdatesOnly}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Update Status</span>
                  <Button
                    onClick={checkForUpdates}
                    disabled={isChecking}
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {isChecking ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Last checked: {lastCheck}</p>
                <p className="text-gray-400 text-sm">{availableUpdates.length} updates available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Updates */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Available Updates ({availableUpdates.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableUpdates.map((update) => (
            <div key={update.version} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-semibold">DBMT v{update.version}</h4>
                      <Badge className={getTypeColor(update.type)}>
                        {update.type}
                      </Badge>
                      {update.critical && (
                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Released {update.releaseDate} • {update.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(update.status)}
                  <Button
                    onClick={() => installUpdate(update.version)}
                    disabled={update.status === 'downloading' || update.status === 'installed'}
                    size="sm"
                    className={
                      update.status === 'installed' 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }
                  >
                    {update.status === 'downloading' ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Installing...
                      </>
                    ) : update.status === 'installed' ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Installed
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-1" />
                        Install
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Changelog */}
              <div className="mt-3">
                <h5 className="text-white font-medium mb-2">What's New:</h5>
                <ul className="space-y-1">
                  {update.changelog.map((change, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <ArrowRight className="h-3 w-3 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>

              {update.critical && (
                <Alert className="mt-3 bg-red-500/10 border-red-500/30">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-red-300">
                    This is a critical security update. Installation is strongly recommended.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ))}

          {availableUpdates.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">All Up to Date</h3>
              <p className="text-gray-400">You're running the latest version of DBMT</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update History & Rollback */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <History className="h-5 w-5 mr-2" />
              Update History
            </CardTitle>
            <Button
              onClick={rollbackVersion}
              size="sm"
              variant="outline"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              <GitBranch className="h-3 w-3 mr-1" />
              Rollback
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {updateHistory.map((history, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    history.status === 'success' ? 'bg-green-400' : 
                    history.status === 'rollback' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium">v{history.version}</div>
                    <div className="text-gray-400 text-sm">
                      {history.installDate} • {history.duration}
                    </div>
                  </div>
                </div>
                <Badge className={
                  history.status === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  history.status === 'rollback' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border-red-500/30'
                }>
                  {history.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
