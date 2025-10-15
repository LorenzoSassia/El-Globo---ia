
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
    onVolver: () => void;
}

const Login: React.FC<LoginProps> = ({ onVolver }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const { iniciarSesion } = useAuth();

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreUsuario || !contrasena) {
      alert('Por favor, ingrese usuario y contraseña.');
      return;
    }
    setCargando(true);
    try {
      await iniciarSesion(nombreUsuario, contrasena);
    } catch (error) {
      console.error("Falló el inicio de sesión", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-center text-gray-400">
            Ingrese sus credenciales para acceder al sistema.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={manejarSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 appearance-none rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 appearance-none rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={cargando}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        
        <div className="p-4 mt-4 text-xs text-gray-400 bg-gray-700 rounded-md">
            <h4 className="font-bold text-gray-300">Usuarios de prueba (la contraseña puede ser cualquiera):</h4>
            <ul className="mt-2 list-disc list-inside">
                <li><strong className="text-gray-200">Admin:</strong> <code className="px-1 py-0.5 bg-gray-600 rounded">admin</code></li>
                <li><strong className="text-gray-200">Cobrador:</strong> <code className="px-1 py-0.5 bg-gray-600 rounded">Roberto Carlos</code></li>
                <li><strong className="text-gray-200">Socio:</strong> <code className="px-1 py-0.5 bg-gray-600 rounded">Juan</code></li>
            </ul>
        </div>
        
        <div className="mt-6 text-center">
           <button 
             onClick={onVolver}
             className="px-6 py-2 text-sm font-semibold text-gray-300 transition bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 hover:text-white"
           >
                Volver a la Página Principal
           </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
