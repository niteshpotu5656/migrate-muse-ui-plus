
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WelcomeSection } from '@/components/WelcomeSection';
import { MigrationWizard } from '@/components/MigrationWizard';
import { MigrationConsole } from '@/components/MigrationConsole';
import { MigrationHistory } from '@/components/MigrationHistory';
import { SettingsPanel } from '@/components/SettingsPanel';
import { 
  Database, 
  Play, 
  History, 
  Settings, 
  BarChart, 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [migrationInProgress, setMigrationInProgress] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DBMT</h1>
                <p className="text-sm text-gray-300">Database Migration Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Healthy
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-gray-900 font-semibold border-gray-300 hover:bg-gray-100"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl border border-white/10">
            <TabsTrigger value="welcome" className="data-[state=active]:bg-white/20 text-white">
              <Database className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="wizard" className="data-[state=active]:bg-white/20 text-white">
              <Play className="h-4 w-4 mr-2" />
              New Migration
            </TabsTrigger>
            <TabsTrigger value="console" className="data-[state=active]:bg-white/20 text-white">
              <BarChart className="h-4 w-4 mr-2" />
              Live Console
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white/20 text-white">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="welcome" className="space-y-6">
            <WelcomeSection onStartMigration={() => setActiveTab('wizard')} />
          </TabsContent>

          <TabsContent value="wizard" className="space-y-6">
            <MigrationWizard onMigrationStart={() => {
              setMigrationInProgress(true);
              setActiveTab('console');
            }} />
          </TabsContent>

          <TabsContent value="console" className="space-y-6">
            <MigrationConsole 
              isActive={migrationInProgress} 
              onMigrationComplete={() => setMigrationInProgress(false)} 
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <MigrationHistory />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
