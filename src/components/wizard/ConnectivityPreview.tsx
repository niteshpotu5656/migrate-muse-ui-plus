
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
  const getDatabaseColorScheme = (type: string): { bg: string; border: string; icon: string } => {
    const colorSchemes: Record<string, { bg: string; border: string; icon: string }> = {
      postgresql: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: 'text-blue-400' },
      mysql: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', icon: 'text-orange-400' },
      mongodb: { bg: 'bg-green-500/20', border: 'border-green-500/30', icon: 'text-green-400' },
      redis: { bg: 'bg-red-500/20', border: 'border-red-500/30', icon: 'text-red-400' },
      oracle: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
      cassandra: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
      elasticsearch: { bg: 'bg-pink-500/20', border: 'border-pink-500/30', icon: 'text-pink-400' },
      neo4j: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400' }
    };
    return colorSchemes[type] || { bg: 'bg-gray-500/20', border: 'border-gray-500/30', icon: 'text-gray-400' };
  };

  const sourceColors = getDatabaseColorScheme(state.sourceConfig.type);
  const targetColors = getDatabaseColorScheme(state.targetConfig.type);

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white">Connectivity Configuration</CardTitle>
        <CardDescription className="text-gray-400">
          Confirm your database selection and proceed to connection setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <div className={`p-6 ${sourceColors.bg} rounded-lg border ${sourceColors.border} shadow-lg`}>
                <Database className={`h-16 w-16 mx-auto ${sourceColors.icon} mb-3`} />
                <p className="text-white font-semibold text-xl">
                  {getDatabaseDisplayName(state.sourceConfig.type)}
                </p>
                <p className="text-gray-300 text-md mt-1">Source Database</p>
              </div>
            </div>
            
            <div className="flex justify-center items-center">
              <div className="w-full h-1 bg-blue-500/30 hidden md:block"></div>
              <div className="rounded-full p-3 bg-indigo-600/20 border border-indigo-500/30">
                <ArrowRight className="h-10 w-10 mx-2 text-indigo-400" />
              </div>
              <div className="w-full h-1 bg-blue-500/30 hidden md:block"></div>
            </div>
            
            <div className="text-center">
              <div className={`p-6 ${targetColors.bg} rounded-lg border ${targetColors.border} shadow-lg`}>
                <Database className={`h-16 w-16 mx-auto ${targetColors.icon} mb-3`} />
                <p className="text-white font-semibold text-xl">
                  {getDatabaseDisplayName(state.targetConfig.type)}
                </p>
                <p className="text-gray-300 text-md mt-1">Target Database</p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-lg">
            <h3 className="text-white font-semibold text-2xl mb-3">Ready to Configure Connection Settings</h3>
            <p className="text-gray-300 text-md mb-6 max-w-2xl mx-auto">
              Next, you'll need to provide connection details for both your source and target databases.
              Make sure you have access credentials and connection parameters ready.
            </p>
            <Button 
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-6 h-auto text-lg"
            >
              Continue to Connection Setup <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
