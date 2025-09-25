import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './features/dashboard/Dashboard';
import Socios from './features/socios/Socios';
import Cobranzas from './features/cobranzas/Cobranzas';
import Actividades from './features/actividades/Actividades';
import Reportes from './features/reportes/Reportes';
import MiPerfil from './features/perfil/MiPerfil';
import Login from './features/auth/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

export type View = 'dashboard' | 'socios' | 'cobranzas' | 'actividades' | 'reportes' | 'perfil';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>('dashboard');

  if (!user) {
    return <Login />;
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
