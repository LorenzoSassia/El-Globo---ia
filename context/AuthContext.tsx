import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
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

  useEffect(() => {
    // Al cargar la app, intentar restaurar la sesión desde localStorage
    try {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (token && storedUser) {
        setUsuario(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al restaurar la sesión:", error);
      // Limpiar en caso de datos corruptos
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, []);


  const iniciarSesion = async (nombreUsuario: string, contrasena: string) => {
    try {
      const { token, usuario: datosUsuario } = await api.login(nombreUsuario, contrasena);
      if (token && datosUsuario) {
        // Guardar el token y los datos del usuario para persistencia
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(datosUsuario));
        setUsuario(datosUsuario);
      } else {
        throw new Error('La respuesta del servidor no contiene token o usuario.');
      }
    } catch (error) {
      console.error('Falló el inicio de sesión:', error);
      // Limpiar cualquier dato antiguo en caso de fallo
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      throw error;
    }
  };

  const cerrarSesion = () => {
    // Limpiar token y datos de usuario para cerrar sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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