
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ArrowRight } from 'lucide-react';
import { useWizard } from './WizardContext';
import { Button } from "@/components/ui/button";

export const ConnectivityPreview: React.FC = () => {
  const { state } = useWizard();

  // Helper function to get display name for database types
  const getDatabaseDisplayName = (type: string): string => {
    const displayNames: Record<string, string> = {
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
      redis: 'Redis',
      oracle: 'Oracle',
      cassandra: 'Cassandra',
      elasticsearch: 'Elasticsearch',
      neo4j: 'Neo4j'
    };
    return displayNames[type] || type;
  };

  // Helper function to get color scheme for database types
  const getDatabaseColorScheme = (type: string): { bg: string; border: string } => {
    const colorSchemes: Record<string, { bg: string; border: string }> = {
      postgresql: { bg: 'bg-blue-500/20', border: 'border-blue-500/30' },
      mysql: { bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
      mongodb: { bg: 'bg-green-500/20', border: 'border-green-500/30' },
      redis: { bg: 'bg-red-500/20', border: 'border-red-500/30' },
      oracle: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' },
      cassandra: { bg: 'bg-purple-500/20', border: 'border-purple-500/30' },
      elasticsearch: { bg: 'bg-pink-500/20', border: 'border-pink-500/30' },
      neo4j: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30' }
    };
    return colorSchemes[type] || { bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
  };

  const sourceColors = getDatabaseColorScheme(state.sourceConfig.type || 'postgresql');
  const targetColors = getDatabaseColorScheme(state.targetConfig.type || 'mongodb');

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white">Connectivity Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Confirm your database selection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <div className={`p-4 ${sourceColors.bg} rounded-lg border ${sourceColors.border}`}>
                <Database className="h-12 w-12 mx-auto text-blue-400 mb-2" />
                <p className="text-white font-semibold text-lg">
                  {getDatabaseDisplayName(state.sourceConfig.type || 'postgresql')}
                </p>
                <p className="text-gray-400 text-sm">Source Database</p>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="w-full h-1 bg-blue-500/30 hidden md:block"></div>
              <ArrowRight className="h-8 w-8 mx-2 text-blue-400" />
              <div className="w-full h-1 bg-blue-500/30 hidden md:block"></div>
            </div>
            
            <div className="text-center">
              <div className={`p-4 ${targetColors.bg} rounded-lg border ${targetColors.border}`}>
                <Database className="h-12 w-12 mx-auto text-purple-400 mb-2" />
                <p className="text-white font-semibold text-lg">
                  {getDatabaseDisplayName(state.targetConfig.type || 'mongodb')}
                </p>
                <p className="text-gray-400 text-sm">Target Database</p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold text-lg mb-2">Ready to Configure Connection Settings</h3>
            <p className="text-gray-400 mb-4">
              Next, you'll need to provide connection details for both your source and target databases.
            </p>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              Continue to Connection Setup <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
