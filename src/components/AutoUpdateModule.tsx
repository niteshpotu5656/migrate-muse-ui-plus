
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  RefreshCw, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  GitBranch,
  Settings,
  Play
} from 'lucide-react';

interface AutoUpdateModuleProps {
  onUpdateStart?: () => void;
}

export const AutoUpdateModule: React.FC<AutoUpdateModuleProps> = ({ onUpdateStart }) => {
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  const availableUpdates = [
    {
      component: 'PostgreSQL Connector',
      currentVersion: '2.4.1',
      availableVersion: '2.5.0',
      type: 'major',
      description: 'Improved connection pooling and JSON handling',
      critical: false,
      size: '2.3 MB'
    },
    {
      component: 'MongoDB Driver',
      currentVersion: '1.8.2',
      availableVersion: '1.8.3',
      type: 'patch',
      description: 'Security patch for authentication handling',
      critical: true,
      size: '1.1 MB'
    },
    {
      component: 'Field Mapping Engine',
      currentVersion: '3.1.0',
      availableVersion: '3.2.0',
      type: 'minor',
      description: 'Enhanced transformation algorithms and new data types',
      critical: false,
      size: '4.7 MB'
    },
    {
      component: 'Validation Framework',
      currentVersion: '1.5.1',
      availableVersion: '1.6.0',
      type: 'minor',
      description: 'New checksum algorithms and integrity verification',
      critical: false,
      size: '1.8 MB'
    }
  ];

  const updateHistory = [
    {
      date: '2024-06-01',
      component: 'MySQL Connector',
      version: '2.1.0 → 2.1.1',
      status: 'success',
      description: 'Bug fixes for large table migrations'
    },
    {
      date: '2024-05-28',
      component: 'Security Module',
      version: '1.3.0 → 1.4.0',
      status: 'success',
      description: 'Enhanced encryption and audit logging'
    },
    {
      date: '2024-05-25',
      component: 'Core Engine',
      version: '4.2.1 → 4.3.0',
      status: 'rollback',
      description: 'Performance regression detected, rolled back'
    }
  ];

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    
    // Simulate update progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUpdateProgress(i);
    }
    
    setIsUpdating(false);
    onUpdateStart?.();
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'major': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'minor': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'patch': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rollback': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <RefreshCw className="h-6 w-6 mr-3" />
                Auto-Update Module
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage connector updates and system patches
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-update"
                  checked={autoUpdateEnabled}
                  onCheckedChange={setAutoUpdateEnabled}
                />
                <Label htmlFor="auto-update" className="text-white">Auto-update</Label>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Available Updates */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Available Updates ({availableUpdates.length})
            </CardTitle>
            <Button 
              onClick={handleUpdateAll}
              disabled={isUpdating}
              className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Update All
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isUpdating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Downloading updates...</span>
                <span className="text-white">{updateProgress}%</span>
              </div>
              <Progress value={updateProgress} className="h-2" />
            </div>
          )}

          <div className="space-y-3">
            {availableUpdates.map((update, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">{update.component}</div>
                      <div className="text-sm text-gray-400">
                        {update.currentVersion} → {update.availableVersion}
                      </div>
                    </div>
                    {update.critical && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getUpdateTypeColor(update.type)}>
                      {update.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-400">{update.size}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{update.description}</p>
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update History */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Update History
          </CardTitle>
          <CardDescription className="text-gray-400">
            Recent system updates and rollbacks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {updateHistory.map((entry, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg border border-white/10">
                {getStatusIcon(entry.status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-medium">{entry.component}</div>
                    <div className="text-sm text-gray-400">{entry.date}</div>
                  </div>
                  <div className="text-sm text-gray-400">{entry.version}</div>
                  <div className="text-sm text-gray-300">{entry.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Settings */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Update Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Automatic Updates</Label>
                <Switch checked={autoUpdateEnabled} onCheckedChange={setAutoUpdateEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white">Security Patches Only</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white">Update Notifications</Label>
                <Switch defaultChecked />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white">Backup Before Update</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white">Rollback on Failure</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-white">Test Environment First</Label>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
