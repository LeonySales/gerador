import React from 'react';
import { Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showHomeButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showHomeButton = false }) => {
  const { setCurrentView } = useApp();

  const handleHomeClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {showHeader && (
        <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {showHomeButton && (
                <button
                  onClick={handleHomeClick}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors rounded-xl px-3 py-2 hover:bg-purple-50"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Início</span>
                </button>
              )}

              <div className="flex items-center space-x-3">
                <img 
                  src={`${import.meta.env.BASE_URL}logo-ninho.png`} 
                  alt="Ninho do Sono Logo" 
                  className="w-12 h-12 rounded-full object-cover shadow-md"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ninho do Sono</h1>
                  <p className="text-sm text-purple-600">Gerador de Rotinas</p>
                </div>
              </div>

              {!showHomeButton && <div className="w-20"></div>}
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
