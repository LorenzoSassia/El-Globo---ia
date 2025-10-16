
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Vista } from '../App';
import { HomeIcon, UsersIcon, CurrencyDollarIcon, SparklesIcon, ChartBarIcon, UserCircleIcon, LogoutIcon, ArchiveIcon, BriefcaseIcon } from './icons';

interface SidebarProps {
  vistaActiva: Vista;
  setVistaActiva: (vista: Vista) => void;
  onCerrarSesion: () => void;
}

const NavItem: React.FC<{
  vista: Vista;
  label: string;
  icon: React.ReactNode;
  vistaActiva: Vista;
  onClick: (vista: Vista) => void;
}> = ({ vista, label, icon, vistaActiva, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(vista);
      }}
      className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-700 ${
        vistaActiva === vista ? 'bg-gray-700 text-white' : 'text-gray-400'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ vistaActiva, setVistaActiva, onCerrarSesion }) => {
  const { usuario } = useAuth();

  const adminLinks: Vista[] = ['dashboard', 'socios', 'cobradores', 'cobranzas', 'actividades', 'casilleros'];
  const cobradorLinks: Vista[] = ['dashboard', 'cobranzas', 'reportes'];
  const socioLinks: Vista[] = ['perfil', 'actividades'];

  let availableLinks: Vista[] = [];
  if (usuario?.rol === 'admin') {
    availableLinks = adminLinks;
  } else if (usuario?.rol === 'cobrador') {
    availableLinks = cobradorLinks;
  } else if (usuario?.rol === 'socio') {
    availableLinks = socioLinks;
  }
  
  const allLinks: { vista: Vista; label: string; icon: React.ReactNode }[] = [
      { vista: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
      { vista: 'socios', label: 'Socios', icon: <UsersIcon /> },
      { vista: 'cobradores', label: 'Cobradores', icon: <BriefcaseIcon /> },
      { vista: 'cobranzas', label: 'Cobranzas', icon: <CurrencyDollarIcon /> },
      { vista: 'actividades', label: 'Actividades', icon: <SparklesIcon /> },
      { vista: 'casilleros', label: 'Casilleros', icon: <ArchiveIcon /> },
      { vista: 'reportes', label: 'Reportes', icon: <ChartBarIcon /> },
      { vista: 'perfil', label: 'Mi Perfil', icon: <UserCircleIcon /> },
  ];

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <div className="mb-6 text-2xl font-semibold text-center text-white">
          Club Manager
        </div>
        <ul className="space-y-2">
          {allLinks
            .filter(link => availableLinks.includes(link.vista))
            .map(link => (
              <NavItem
                key={link.vista}
                vista={link.vista}
                label={link.label}
                icon={link.icon}
                vistaActiva={vistaActiva}
                onClick={setVistaActiva}
              />
          ))}
        </ul>
        <div className="mt-auto">
           <a
            href="#"
            onClick={(e) => { e.preventDefault(); onCerrarSesion(); }}
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