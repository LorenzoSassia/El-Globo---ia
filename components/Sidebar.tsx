import React from 'react';
// Fix: Correct import path from '../App' to './App'
import { View } from '../App';
import { ChartBarIcon, UsersIcon, CurrencyDollarIcon, SparklesIcon, DocumentTextIcon, GlobeAltIcon, LogoutIcon, UserCircleIcon } from './icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  activeView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, activeView, onClick }) => (
  <li className="mb-2">
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(view);
      }}
      className={`flex items-center p-3 text-base font-normal rounded-lg transition duration-75 hover:bg-gray-700 ${
        activeView === view ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const allNavItems = [
    { view: 'dashboard' as View, label: 'Dashboard', icon: <ChartBarIcon />, roles: [UserRole.ADMIN] },
    { view: 'socios' as View, label: 'Socios', icon: <UsersIcon />, roles: [UserRole.ADMIN] },
    { view: 'cobranzas' as View, label: 'Cobranzas', icon: <CurrencyDollarIcon />, roles: [UserRole.ADMIN, UserRole.COBRADOR] },
    { view: 'actividades' as View, label: 'Actividades', icon: <SparklesIcon />, roles: [UserRole.ADMIN, UserRole.SOCIO] },
    { view: 'reportes' as View, label: 'Reportes', icon: <DocumentTextIcon />, roles: [UserRole.ADMIN] },
    { view: 'perfil' as View, label: 'Mi Perfil', icon: <UserCircleIcon />, roles: [UserRole.SOCIO] }
  ];

  const navItems = allNavItems.filter(item => user && item.roles.includes(user.role));


  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="flex flex-col h-full p-4 bg-gray-800">
        <div className="flex items-center pb-4 mb-4 border-b border-gray-600">
          <GlobeAltIcon className="w-8 h-8 text-white mr-3" />
          <span className="text-xl font-semibold text-white">Club El Globo</span>
        </div>
        <ul className="space-y-2 flex-grow">
          {navItems.map((item) => (
            <NavItem
              key={item.view}
              view={item.view}
              label={item.label}
              icon={item.icon}
              activeView={activeView}
              onClick={setActiveView}
            />
          ))}
        </ul>
        <div className="pt-2 border-t border-gray-700">
             <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
              className={`flex items-center p-3 text-base font-normal rounded-lg transition duration-75 text-gray-400 hover:bg-gray-700 hover:text-white`}
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
