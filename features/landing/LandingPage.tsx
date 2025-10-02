import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Activity } from '../../types';

interface LandingPageProps {
    onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        mockApi.getActivities().then(setActivities);
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-white">Club El Globo</h1>
                <button 
                    onClick={onLoginClick} 
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </nav>

            {/* Hero Section */}
            <header className="text-center py-24 px-4">
                <h2 className="text-5xl md:text-6xl font-extrabold text-white">
                    Tu Lugar Para el Deporte y la Amistad
                </h2>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                    Únete a nuestra comunidad y descubre un espacio para crecer, competir y compartir.
                </p>
            </header>

            {/* Activities Section */}
            <main className="container mx-auto px-6 pb-24">
                <h3 className="text-3xl font-bold text-center mb-12 text-white">Nuestras Actividades</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activities.map(activity => (
                        <div key={activity.id} className="bg-gray-800 rounded-lg p-6 flex flex-col transform hover:-translate-y-2 transition-transform duration-300 shadow-lg">
                            <h4 className="text-xl font-semibold text-white">{activity.name}</h4>
                            <p className="text-gray-400 capitalize mt-1">{activity.schedule}</p>
                            <div className="mt-auto pt-4">
                                <p className="text-2xl font-bold text-blue-400">${activity.cost.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 text-center text-gray-400">
                <div className="container mx-auto">
                    <p>Club El Globo | Dirección: Av. Siempreviva 742, Rosario</p>
                    <p>Teléfono: (0341) 456-7890</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;