
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Vista } from '../App';
import { RolUsuario } from '../types';
import { HomeIcon, UsersIcon, CurrencyDollarIcon, SparklesIcon, ChartBarIcon, UserCircleIcon, LogoutIcon, ArchiveIcon } from './icons';

interface SidebarProps {
  vistaActiva: Vista;
  setVistaActiva: (vista: Vista) => void;
  onCerrarSesion: () => void;
}

const ElementoNavegacion: React.FC<{
  vista: Vista;
  etiqueta: string;
  icono: React.ReactNode;
  vistaActiva: Vista;
  onClick: (vista: Vista) => void;
}> = ({ vista, etiqueta, icono, vistaActiva, onClick }) => (
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
      {icono}
      <span className="ml-3">{etiqueta}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ vistaActiva, setVistaActiva, onCerrarSesion }) => {
  const { usuario } = useAuth();

  const enlacesAdmin: Vista[] = ['panel', 'socios', 'cobranzas', 'actividades', 'casilleros'];
  const enlacesCobrador: Vista[] = ['panel', 'cobranzas', 'reportes'];
  const enlacesSocio: Vista[] = ['perfil', 'actividades'];

  let enlacesDisponibles: Vista[] = [];
  if (usuario?.rol === RolUsuario.ADMIN) {
    enlacesDisponibles = enlacesAdmin;
  } else if (usuario?.rol === RolUsuario.COBRADOR) {
    enlacesDisponibles = enlacesCobrador;
  } else if (usuario?.rol === RolUsuario.SOCIO) {
    enlacesDisponibles = enlacesSocio;
  }
  
  const todosLosEnlaces: { vista: Vista; etiqueta: string; icono: React.ReactNode }[] = [
      { vista: 'panel', etiqueta: 'Dashboard', icono: <HomeIcon /> },
      { vista: 'socios', etiqueta: 'Socios', icono: <UsersIcon /> },
      { vista: 'cobranzas', etiqueta: 'Cobranzas', icono: <CurrencyDollarIcon /> },
      { vista: 'actividades', etiqueta: 'Actividades', icono: <SparklesIcon /> },
      { vista: 'casilleros', etiqueta: 'Casilleros', icono: <ArchiveIcon /> },
      { vista: 'reportes', etiqueta: 'Reportes', icono: <ChartBarIcon /> },
      { vista: 'perfil', etiqueta: 'Mi Perfil', icono: <UserCircleIcon /> },
  ];

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="flex flex-col h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <div className="mb-6 text-2xl font-semibold text-center text-white">
          Club Manager
        </div>
        <ul className="space-y-2">
          {todosLosEnlaces
            .filter(enlace => enlacesDisponibles.includes(enlace.vista))
            .map(enlace => (
              <ElementoNavegacion
                key={enlace.vista}
                vista={enlace.vista}
                etiqueta={enlace.etiqueta}
                icono={enlace.icono}
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
