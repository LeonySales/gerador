import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Child, Parent, SleepRoutine } from '../types';

type CurrentView =
  | 'login'
  | 'dashboard'
  | 'quiz'
  | 'routine-result'
  | 'environment-checklist'
  | 'pre-sleep-checklist'
  | 'admin-dashboard';

interface AppContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  currentView: CurrentView;
  setCurrentView: (view: CurrentView) => void;
  child: Partial<Child>;
  setChild: (child: Partial<Child>) => void;
  parent: Partial<Parent>;
  setParent: (parent: Partial<Parent>) => void;
  generatedRoutine: SleepRoutine | null;
  setGeneratedRoutine: (routine: SleepRoutine | null) => void;

  // Login / autorização
  isAuthorized: boolean;
  setIsAuthorized: (value: boolean) => void;

  userEmail: string;
  setUserEmail: (email: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentView, setCurrentView] = useState<CurrentView>('login');
  const [child, setChild] = useState<Partial<Child>>({});
  const [parent, setParent] = useState<Partial<Parent>>({});
  const [generatedRoutine, setGeneratedRoutine] = useState<SleepRoutine | null>(null);

  // Estado para controle de login
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <AppContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        currentView,
        setCurrentView,
        child,
        setChild,
        parent,
        setParent,
        generatedRoutine,
        setGeneratedRoutine,
        isAuthorized,
        setIsAuthorized,
        userEmail,
        setUserEmail,
        userName,
        setUserName,
        adminLoggedIn,
        setAdminLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
