
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Login: React.FC = () => {
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-extrabold text-center text-white">
            Club Manager
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
