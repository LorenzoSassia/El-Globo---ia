import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
    onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { iniciarSesion } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !contrasena) {
      setError('Por favor, ingrese usuario y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await iniciarSesion(usuario, contrasena);
      // El éxito redirigirá automáticamente a través del estado del AuthContext en App.tsx
    } catch (err) {
      setError('Error de inicio de sesión: Usuario o contraseña incorrectos.');
      console.error("Falló el inicio de sesión", err);
    } finally {
      setLoading(false);
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 text-sm text-center text-white bg-red-500 rounded-md">{error}</div>}
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="usuario" className="sr-only">Usuario</label>
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 appearance-none rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
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
              disabled={loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
           <button 
             onClick={onBack}
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
