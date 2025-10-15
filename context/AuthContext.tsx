
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Usuario, RolUsuario } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  usuario: Usuario | null;
  iniciarSesion: (nombreUsuario: string, contrasena?: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const iniciarSesion = async (nombreUsuario: string, contrasena?: string) => {
    // Lógica de inicio de sesión simulada
    let usuarioMock: Usuario | null = null;

    // 1. Comprobar si es Admin
    if (nombreUsuario.toLowerCase() === 'admin') {
      usuarioMock = { nombreUsuario, rol: RolUsuario.ADMIN };
    }

    // 2. Comprobar si es Cobrador
    if (!usuarioMock) {
      const cobrador = await mockApi.getCobradorPorNombre(nombreUsuario);
      if (cobrador) {
        usuarioMock = {
          nombreUsuario: cobrador.nombre,
          rol: RolUsuario.COBRADOR,
          cobradorId: cobrador.id,
          zona: cobrador.zona,
        };
      }
    }

    // 3. Comprobar si es Socio (por nombre para la simulación)
    if (!usuarioMock) {
      const socios = await mockApi.getSocios();
      const socio = socios.find(m => m.nombre.toLowerCase() === nombreUsuario.toLowerCase());
      if (socio) {
        usuarioMock = {
          nombreUsuario: `${socio.nombre} ${socio.apellido}`,
          rol: RolUsuario.SOCIO,
          socioId: socio.id,
        };
      }
    }

    if (usuarioMock) {
      setUsuario(usuarioMock);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
