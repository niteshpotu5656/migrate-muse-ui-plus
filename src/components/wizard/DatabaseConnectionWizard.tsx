
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from 'lucide-react';
import { DatabaseConnectionForm } from './DatabaseConnectionForm';

interface DatabaseConnectionWizardProps {
  type: 'source' | 'target';
}

export const DatabaseConnectionWizard: React.FC<DatabaseConnectionWizardProps> = ({ type }) => {
  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Database className="h-6 w-6 mr-3 text-indigo-400" />
          {type === 'source' ? 'Source' : 'Target'} Database Connection
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure connection details for your {type === 'source' ? 'source' : 'target'} database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DatabaseConnectionForm 
          type={type} 
          dbType={type === 'source' ? 'PostgreSQL' : 'MongoDB'} 
        />
      </CardContent>
    </div>
  );
};
