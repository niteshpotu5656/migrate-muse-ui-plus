
import React, { useState, createContext, useContext } from 'react';

interface MigrationState {
  sourceConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
  };
  targetConfig: {
    type: string;
    host: string;
    port: number;
    database: string;
    username?: string;
    password?: string;
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
}

const defaultMigrationState: MigrationState = {
  sourceConfig: {
    type: '',
    host: 'localhost',
    port: 0,
    database: ''
  },
  targetConfig: {
    type: '',
    host: 'localhost',
    port: 0,
    database: ''
  },
  fieldMappings: [],
  validationRules: [],
  dryRunOptions: {
    batchSize: 1000,
    enableValidation: true
  },
  migrationOptions: {
    truncateTarget: false
  }
};

interface WizardContextProps {
  state: MigrationState;
  updateState: (newState: Partial<MigrationState>) => void;
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

  return (
    <WizardContext.Provider value={{ state, updateState }}>
      {children}
    </WizardContext.Provider>
  );
};
