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

export type Vista = 'dashboard' | 'socios' | 'cobranzas' | 'actividades' | 'reportes' | 'perfil' | 'casilleros';

const AppContent: React.FC = () => {
  const { usuario, cerrarSesion } = useAuth();
  const [vistaActiva, setVistaActiva] = useState<Vista>('dashboard');
  const [ingresando, setIngresando] = useState(false);

  if (!usuario) {
    if (ingresando) {
        return <Login onBack={() => setIngresando(false)} />;
    }
    return <LandingPage onIngresarClick={() => setIngresando(true)} />;
  }

  const handleCerrarSesion = () => {
    cerrarSesion();
    setIngresando(false);
  }

  const renderizarVista = () => {
    switch (vistaActiva) {
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
        // Vista por defecto para admin/cobrador es dashboard, para socio es perfil
        if (usuario.rol === 'socio') {
            setVistaActiva('perfil');
            return <MiPerfil />;
        }
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} onCerrarSesion={handleCerrarSesion} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderizarVista()}
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
