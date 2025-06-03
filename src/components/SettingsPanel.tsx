
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Shield, 
  Database,
  Bell,
  Users,
  Globe,
  Key,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [autoUpdates, setAutoUpdates] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [encryption, setEncryption] = useState(true);
  const [backups, setBackups] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl flex items-center">
                <Settings className="h-6 w-6 mr-3 text-purple-400" />
                System Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure DBMT preferences, security, and system behavior
              </CardDescription>
            </div>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              Professional Edition
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
          <CardContent className="p-6">
            <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl border border-white/10">
              <TabsTrigger value="general" className="data-[state=active]:bg-white/20 text-white">
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/20 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="database" className="data-[state=active]:bg-white/20 text-white">
                <Database className="h-4 w-4 mr-2" />
                Database
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20 text-white">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-white/20 text-white">
                <Globe className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Application Preferences</CardTitle>
              <CardDescription className="text-gray-400">Configure general application behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Default Migration Timeout</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="24 hours" />
                  </div>
                  <div>
                    <Label className="text-white">Batch Size</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="10000" />
                  </div>
                  <div>
                    <Label className="text-white">Max Concurrent Connections</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="50" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Auto-save Configuration</Label>
                      <p className="text-sm text-gray-400 mt-1">Automatically save migration configurations</p>
                    </div>
                    <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Dark Mode</Label>
                      <p className="text-sm text-gray-400 mt-1">Use dark theme (currently enabled)</p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Automatic Backups</Label>
                      <p className="text-sm text-gray-400 mt-1">Create backups before migrations</p>
                    </div>
                    <Switch checked={backups} onCheckedChange={setBackups} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-gray-400">Version</Label>
                  <p className="text-white font-semibold">DBMT v2.1.0</p>
                </div>
                <div>
                  <Label className="text-gray-400">License</Label>
                  <p className="text-white font-semibold">Professional</p>
                </div>
                <div>
                  <Label className="text-gray-400">Last Updated</Label>
                  <p className="text-white font-semibold">2024-01-15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Security & Encryption
              </CardTitle>
              <CardDescription className="text-gray-400">Manage security settings and encryption</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3 text-green-400" />
                  <div>
                    <Label className="text-white">End-to-End Encryption</Label>
                    <p className="text-sm text-gray-400">All data transfers are encrypted</p>
                  </div>
                </div>
                <Switch checked={encryption} onCheckedChange={setEncryption} />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white">Encryption Key</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input className="bg-white/5 border-white/10 text-white" value="••••••••••••••••••••••••••••••••" readOnly />
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-white">SSL Certificate</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input className="bg-white/5 border-white/10 text-white" placeholder="Upload SSL certificate" />
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-4">
                <h4 className="text-white font-semibold">Access Control</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Session Timeout</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="30 minutes" />
                  </div>
                  <div>
                    <Label className="text-white">Max Login Attempts</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-400" />
                Internal Database Management
              </CardTitle>
              <CardDescription className="text-gray-400">Manage the internal PostgreSQL JSONB database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold">Database Status</h4>
                    <p className="text-sm text-gray-400">Internal PostgreSQL database is healthy</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Online
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white">2.3 GB</div>
                  <div className="text-sm text-gray-400">Database Size</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white">247</div>
                  <div className="text-sm text-gray-400">Migration Records</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-sm text-gray-400">Active Connections</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  Export Backup
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup
                </Button>
                <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Migration Completion</Label>
                    <p className="text-sm text-gray-400">Notify when migrations complete</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Error Alerts</Label>
                    <p className="text-sm text-gray-400">Notify when errors occur</p>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">System Updates</Label>
                    <p className="text-sm text-gray-400">Notify about system updates</p>
                  </div>
                  <Switch checked={autoUpdates} onCheckedChange={setAutoUpdates} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Performance Warnings</Label>
                    <p className="text-sm text-gray-400">Notify about performance issues</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="h-5 w-5 mr-2 text-purple-400" />
                Advanced Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Advanced settings for expert users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-400" />
                  <span className="text-white">Warning: These settings can affect system stability</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Memory Pool Size</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="2048 MB" />
                  </div>
                  <div>
                    <Label className="text-white">Thread Pool Size</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="16" />
                  </div>
                  <div>
                    <Label className="text-white">Connection Pool Size</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="100" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Log Level</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="INFO" />
                  </div>
                  <div>
                    <Label className="text-white">Retry Attempts</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="3" />
                  </div>
                  <div>
                    <Label className="text-white">Timeout Multiplier</Label>
                    <Input className="mt-2 bg-white/5 border-white/10 text-white" defaultValue="1.5" />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  Save Configuration
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
