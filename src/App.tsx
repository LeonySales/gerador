import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import RoutineResult from './components/RoutineResult';
import SleepEnvironmentChecklist from './components/SleepEnvironmentChecklist';
import PreSleepChecklist from './components/PreSleepChecklist';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { generateRoutine } from './utils/routineGenerator';

const AppContent: React.FC = () => {
  const {
    currentView,
    currentStep,
    child,
    parent,
    setGeneratedRoutine,
    setCurrentStep,
    setCurrentView,
    isAuthorized,
    adminLoggedIn
  } = useApp();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (currentStep === 6 && child.name && child.ageMonths && parent.name) {
      try {
        const routine = generateRoutine(child, parent);
        setGeneratedRoutine(routine);
        setCurrentView('routine-result');
        setCurrentStep(0);
      } catch (error) {
        console.error('Erro ao gerar rotina:', error);
      }
    }
  }, [currentStep, child, parent, setGeneratedRoutine, setCurrentStep, setCurrentView]);

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem('authorized');
      if (!stored) {
        setCurrentView('login');
      } else {
        const parsed = JSON.parse(stored);
        if (parsed.email === 'leony@admin.com') {
          setCurrentView('admin-dashboard');
        } else {
          setCurrentView('dashboard');
        }
      }
      setLoaded(true);
    };
    checkAuth();
  }, [setCurrentView]);

  const renderCurrentView = () => {
    if (!isAuthorized) return <Login />;
    if (adminLoggedIn) return <AdminDashboard />;

    switch (currentView) {
      case 'quiz':
        return <Quiz />;
      case 'routine-result':
        return <RoutineResult />;
      case 'environment-checklist':
        return <SleepEnvironmentChecklist onBack={() => setCurrentView('dashboard')} />;
      case 'pre-sleep-checklist':
        return <PreSleepChecklist onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard />;
    }
  };

  return loaded ? <Layout>{renderCurrentView()}</Layout> : <div className="p-8">Carregando...</div>;
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;  // **IMPORTANTE: export default aqui**
