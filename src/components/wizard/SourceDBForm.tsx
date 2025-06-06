
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, CheckCircle } from 'lucide-react';
import { useWizard } from './WizardContext';

interface DatabaseOption {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
}

export const SourceDBForm: React.FC = () => {
  const { state, updateState } = useWizard();
  
  const databaseOptions: DatabaseOption[] = [
    { 
      id: 'postgresql', 
      name: 'PostgreSQL', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-blue-500/30 bg-blue-500/10' 
    },
    { 
      id: 'mysql', 
      name: 'MySQL', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-orange-500/30 bg-orange-500/10' 
    },
    { 
      id: 'mongodb', 
      name: 'MongoDB', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-green-500/30 bg-green-500/10' 
    },
    { 
      id: 'redis', 
      name: 'Redis', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-red-500/30 bg-red-500/10' 
    },
    { 
      id: 'oracle', 
      name: 'Oracle', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-yellow-500/30 bg-yellow-500/10' 
    },
    { 
      id: 'cassandra', 
      name: 'Cassandra', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-purple-500/30 bg-purple-500/10' 
    },
    { 
      id: 'elasticsearch', 
      name: 'Elasticsearch', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-pink-500/30 bg-pink-500/10' 
    },
    { 
      id: 'neo4j', 
      name: 'Neo4j', 
      icon: <Database className="h-12 w-12" />, 
      color: 'border-cyan-500/30 bg-cyan-500/10' 
    },
  ];

  const handleSelectDB = (dbType: string) => {
    updateState({
      sourceConfig: { ...state.sourceConfig, type: dbType }
    });
  };

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white">Select Source Database</CardTitle>
        <CardDescription className="text-gray-400">
          Choose the type of database you want to migrate from
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {databaseOptions.map((db) => (
            <div
              key={db.id}
              onClick={() => handleSelectDB(db.id)}
              className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
                state.sourceConfig.type === db.id
                  ? `${db.color} ring-2 ring-blue-500`
                  : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {state.sourceConfig.type === db.id && (
                <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-500" />
              )}
              <div className="flex flex-col items-center justify-center py-4">
                <div className={`text-${db.id === state.sourceConfig.type ? 'blue' : 'gray'}-400`}>
                  {db.icon}
                </div>
                <h3 className="mt-4 text-white font-medium">{db.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};
