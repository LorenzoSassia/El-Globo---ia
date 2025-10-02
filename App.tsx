import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './features/dashboard/Dashboard';
import Socios from './features/socios/Socios';
import Cobranzas from './features/cobranzas/Cobranzas';
import Actividades from './features/actividades/Actividades';
import Reportes from './features/reportes/Reportes';
import MiPerfil from './features/perfil/MiPerfil';
import Login from './features/auth/Login';
import Casilleros from './features/casilleros/Casilleros';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './features/landing/LandingPage';

export type View = 'dashboard' | 'socios' | 'cobranzas' | 'actividades' | 'reportes' | 'perfil' | 'casilleros';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  if (!user) {
    if (showLogin) {
      return <Login onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
  }


  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'socios':
        return <Socios />;
      case 'cobranzas':
        return <Cobranzas />;
      case 'actividades':
        return <Actividades />;
      case 'reportes':
        return <Reportes />;
      case 'casilleros':
        return <Casilleros />;
      case 'perfil':
        return <MiPerfil />;
      default:
        // Default to dashboard for admin/cobrador, perfil for socio
        if (user.role === 'socio') {
            setActiveView('perfil');
            return <MiPerfil />;
        }
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;