import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginProps {
    onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: UserRole) => {
    if (username.trim() && password.trim()) {
      login(role, username, password);
    } else {
      alert('Por favor ingrese un nombre de usuario y contraseña.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div className="absolute top-6 left-6">
        <button
            onClick={onBack}
            className="flex items-center px-4 py-2 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
        </button>
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Club El Globo
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Inicie sesión para continuar
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="relative block w-full px-3 py-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nombre de usuario (ej: Admin)"
            />
          </div>
          <div>
             <label htmlFor="password" className="sr-only">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full px-3 py-2 mt-2 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-center text-gray-400">
              Seleccione un rol para simular el inicio de sesión:
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleLogin(UserRole.ADMIN)}
                className="w-full px-4 py-2 font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ingresar como Admin
              </button>
              <button
                onClick={() => handleLogin(UserRole.COBRADOR)}
                className="w-full px-4 py-2 font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Ingresar como Cobrador
              </button>
              <button
                onClick={() => handleLogin(UserRole.SOCIO)}
                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ingresar como Socio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;