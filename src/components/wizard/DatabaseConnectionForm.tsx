
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database, Server, Lock, Key, FileCheck } from 'lucide-react';
import { useWizard } from './WizardContext';

interface DatabaseConnectionFormProps {
  type: 'source' | 'target';
  dbType: string;
}

export const DatabaseConnectionForm: React.FC<DatabaseConnectionFormProps> = ({ type, dbType }) => {
  const { state, updateState } = useWizard();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Determine which config to use based on type
  const config = type === 'source' ? state.sourceConfig : state.targetConfig;
  
  // Update the appropriate config in the context
  const updateConfig = (data: Partial<typeof config>) => {
    if (type === 'source') {
      updateState({
        sourceConfig: { ...state.sourceConfig, ...data }
      });
    } else {
      updateState({
        targetConfig: { ...state.targetConfig, ...data }
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      updateConfig({ [name]: parseInt(value, 10) || 0 });
    } else if (type === 'checkbox') {
      updateConfig({ [name]: e.target.checked });
    } else {
      updateConfig({ [name]: value });
    }
  };
  
  // Simulate connection test
  const handleTestConnection = () => {
    setIsConnecting(true);
    
    // Display a loading toast
    const toastId = toast({
      title: "Testing Connection...",
      description: `Connecting to ${config.database} on ${config.host}:${config.port}`,
    });
    
    setTimeout(() => {
      // Randomly succeed or fail for simulation
      const success = Math.random() > 0.3;
      
      if (success) {
        toast({
          title: "✅ Connection Successful",
          description: `Successfully connected to ${dbType} database at ${config.host}`,
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Connection Failed",
          description: `Could not connect to ${config.host}:${config.port}. Check credentials and try again.`,
          variant: "destructive",
        });
      }
      
      setIsConnecting(false);
    }, 2000);
  };
  
  const getDbDisplayName = () => {
    const dbNames: Record<string, string> = {
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
      redis: 'Redis',
      oracle: 'Oracle',
      cassandra: 'Cassandra',
      elasticsearch: 'Elasticsearch',
      neo4j: 'Neo4j'
    };
    
    return dbNames[config.type] || config.type;
  };
  
  return (
    <Card className="border-gray-700 bg-gray-800 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center mb-6 bg-gray-900 p-3 rounded-md border border-gray-700">
            <Database className="h-8 w-8 text-indigo-400 mr-4" />
            <div>
              <h3 className="text-white font-medium">{getDbDisplayName()}</h3>
              <p className="text-gray-400 text-sm">{type === 'source' ? 'Source' : 'Target'} Database Connection</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor={`${type}-host`} className="text-white flex items-center">
                <Server className="h-4 w-4 mr-2 text-gray-400" />
                Host
              </Label>
              <Input
                id={`${type}-host`}
                name="host"
                value={config.host}
                onChange={handleInputChange}
                placeholder="localhost"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor={`${type}-port`} className="text-white flex items-center">
                <Server className="h-4 w-4 mr-2 text-gray-400" />
                Port
              </Label>
              <Input
                id={`${type}-port`}
                name="port"
                type="number"
                value={config.port}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor={`${type}-database`} className="text-white flex items-center">
                <Database className="h-4 w-4 mr-2 text-gray-400" />
                Database Name
              </Label>
              <Input
                id={`${type}-database`}
                name="database"
                value={config.database}
                onChange={handleInputChange}
                placeholder="mydb"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor={`${type}-username`} className="text-white flex items-center">
                <Key className="h-4 w-4 mr-2 text-gray-400" />
                Username
              </Label>
              <Input
                id={`${type}-username`}
                name="username"
                value={config.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor={`${type}-password`} className="text-white flex items-center">
                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                Password
              </Label>
              <Input
                id={`${type}-password`}
                type="password"
                name="password"
                value={config.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="bg-gray-900 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${type}-ssl`} className="text-white flex items-center cursor-pointer">
                  <Lock className="h-4 w-4 mr-2 text-gray-400" />
                  Use SSL Connection
                </Label>
                <Switch
                  id={`${type}-ssl`}
                  name="useSSL"
                  checked={config.useSSL}
                  onCheckedChange={(checked) => updateConfig({ useSSL: checked })}
                />
              </div>
              <p className="text-xs text-gray-400">Secure connection using SSL/TLS encryption</p>
            </div>
          </div>
          
          <Button 
            onClick={handleTestConnection}
            disabled={isConnecting}
            className="w-full mt-4 bg-white text-gray-900 hover:bg-gray-100"
          >
            <FileCheck className="h-4 w-4 mr-2" />
            {isConnecting ? 'Testing Connection...' : 'Test Connection'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
