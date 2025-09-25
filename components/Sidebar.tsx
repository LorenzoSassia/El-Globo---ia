
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View } from '../App';
import { UserRole } from '../types';
import { HomeIcon, UsersIcon, CurrencyDollarIcon, SparklesIcon, ChartBarIcon, UserCircleIcon, LogoutIcon, ArchiveIcon } from './icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, activeView, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(view);
      }}
      className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-700 ${
        activeView === view ? 'bg-gray-700 text-white' : 'text-gray-400'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const adminLinks: View[] = ['dashboard', 'socios', 'cobranzas', 'actividades', 'casilleros'];
  const cobradorLinks: View[] = ['dashboard', 'cobranzas', 'reportes'];
  const socioLinks: View[] = ['perfil', 'actividades'];

  let availableLinks: View[] = [];
  if (user?.role === UserRole.ADMIN) {
    availableLinks = adminLinks;
  } else if (user?.role === UserRole.COBRADOR) {
    availableLinks = cobradorLinks;
  } else if (user?.role === UserRole.SOCIO) {
    availableLinks = socioLinks;
  }
  
  const allLinks: { view: View; label: string; icon: React.ReactNode }[] = [
      { view: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
      { view: 'socios', label: 'Socios', icon: <UsersIcon /> },
      { view: 'cobranzas', label: 'Cobranzas', icon: <CurrencyDollarIcon /> },
      { view: 'actividades', label: 'Actividades', icon: <SparklesIcon /> },
      { view: 'casilleros', label: 'Casilleros', icon: <ArchiveIcon /> },
      { view: 'reportes', label: 'Reportes', icon: <ChartBarIcon /> },
      { view: 'perfil', label: 'Mi Perfil', icon: <UserCircleIcon /> },
  ];

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <div className="mb-6 text-2xl font-semibold text-center text-white">
          Club Manager
        </div>
        <ul className="space-y-2">
          {allLinks
            .filter(link => availableLinks.includes(link.view))
            .map(link => (
              <NavItem
                key={link.view}
                view={link.view}
                label={link.label}
                icon={link.icon}
                activeView={activeView}
                onClick={setActiveView}
              />
          ))}
        </ul>
        <div className="mt-auto">
           <a
            href="#"
            onClick={(e) => { e.preventDefault(); logout(); }}
            className="flex items-center p-2 text-base font-normal text-gray-400 rounded-lg hover:bg-gray-700"
          >
            <LogoutIcon />
            <span className="ml-3">Cerrar Sesión</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;