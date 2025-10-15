import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Usuario } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  iniciarSesion: (nombreUsuario: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const iniciarSesion = async (nombreUsuario: string, contrasena: string) => {
    try {
      const datosUsuario: any = await api.login(nombreUsuario, contrasena);
      if (datosUsuario && datosUsuario.id) {
        // En un caso real, el token JWT se guardaría aquí.
        // Por ahora, guardamos los datos del usuario en el estado.
        setUsuario({
          id: datosUsuario.id,
          usuario: datosUsuario.usuario,
          rol: datosUsuario.rol,
          socioId: datosUsuario.socioId,
          cobradorId: datosUsuario.cobradorId,
          zonaId: datosUsuario.zonaId,
        });
      } else {
        // La API debería devolver un error 401 que sería capturado por el catch.
        // Este es un fallback.
        throw new Error('Credenciales inválidas');
      }
    } catch (error) {
      console.error('Falló el inicio de sesión:', error);
      // Relanzamos el error para que el componente de Login pueda manejarlo
      throw error;
    }
  };

  const cerrarSesion = () => {
    // En un caso real, se limpiaría el token JWT.
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
