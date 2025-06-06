
import React, { useState, createContext, useContext } from 'react';

interface MigrationState {
  sourceConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    useSSL: boolean;
  };
  targetConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    useSSL: boolean;
  };
  fieldMappings: {
    sourceField: string;
    targetField: string;
  }[];
  validationRules: {
    field: string;
    rule: string;
  }[];
  dryRunOptions: {
    batchSize: number;
    enableValidation: boolean;
  };
  migrationOptions: {
    truncateTarget: boolean;
  };
  validationPassed: boolean;
  dryRunPassed: boolean;
  migrationProgress: number;
  migrationLogs: string[];
}

const defaultMigrationState: MigrationState = {
  sourceConfig: {
    type: '',
    host: 'localhost',
    port: 5432,
    database: '',
    username: '',
    password: '',
    useSSL: true
  },
  targetConfig: {
    type: '',
    host: 'localhost',
    port: 27017,
    database: '',
    username: '',
    password: '',
    useSSL: true
  },
  fieldMappings: [],
  validationRules: [],
  dryRunOptions: {
    batchSize: 1000,
    enableValidation: true
  },
  migrationOptions: {
    truncateTarget: false
  },
  validationPassed: false,
  dryRunPassed: false,
  migrationProgress: 0,
  migrationLogs: []
};

interface WizardContextProps {
  state: MigrationState;
  updateState: (newState: Partial<MigrationState>) => void;
  addMigrationLog: (log: string) => void;
  resetMigrationLogs: () => void;
  setValidationPassed: (passed: boolean) => void;
  setDryRunPassed: (passed: boolean) => void;
  updateMigrationProgress: (progress: number) => void;
}

const WizardContext = createContext<WizardContextProps | undefined>(undefined);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};

interface WizardProviderProps {
  children: React.ReactNode;
}

export const WizardProvider: React.FC<WizardProviderProps> = ({ children }) => {
  const [state, setState] = useState<MigrationState>(defaultMigrationState);

  const updateState = (newState: Partial<MigrationState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  const addMigrationLog = (log: string) => {
    setState(prevState => ({
      ...prevState,
      migrationLogs: [...prevState.migrationLogs, `[${new Date().toISOString()}] ${log}`]
    }));
  };

  const resetMigrationLogs = () => {
    setState(prevState => ({
      ...prevState,
      migrationLogs: []
    }));
  };

  const setValidationPassed = (passed: boolean) => {
    setState(prevState => ({
      ...prevState,
      validationPassed: passed
    }));
  };

  const setDryRunPassed = (passed: boolean) => {
    setState(prevState => ({
      ...prevState,
      dryRunPassed: passed
    }));
  };

  const updateMigrationProgress = (progress: number) => {
    setState(prevState => ({
      ...prevState,
      migrationProgress: progress
    }));
  };

  return (
    <WizardContext.Provider value={{ 
      state, 
      updateState, 
      addMigrationLog, 
      resetMigrationLogs,
      setValidationPassed,
      setDryRunPassed,
      updateMigrationProgress
    }}>
      {children}
    </WizardContext.Provider>
  );
};
