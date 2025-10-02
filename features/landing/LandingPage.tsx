import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Activity } from '../../types';

interface LandingPageProps {
    onLoginClick: () => void;
}

const activityImages = [
    { name: 'Natación', url: 'https://images.unsplash.com/photo-1542766788-a2f588f447ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Gimnasio', url: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Tenis', url: 'https://images.unsplash.com/photo-1543884393-2c1b4831034f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Yoga', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        mockApi.getActivities().then(setActivities);
    }, []);

    useEffect(() => {
        if (activityImages.length === 0) return;
        const timer = setTimeout(() => {
            const nextIndex = (currentImageIndex + 1) % activityImages.length;
            setCurrentImageIndex(nextIndex);
        }, 5000); // Change image every 5 seconds
        return () => clearTimeout(timer);
    }, [currentImageIndex]);

    const goToPrevious = () => {
        const isFirstImage = currentImageIndex === 0;
        const newIndex = isFirstImage ? activityImages.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
    };

    const goToNext = () => {
        const isLastImage = currentImageIndex === activityImages.length - 1;
        const newIndex = isLastImage ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Navbar */}
            <nav className="p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm fixed top-0 w-full z-20">
                <h1 className="text-2xl font-bold text-white">Club El Globo</h1>
                <button 
                    onClick={onLoginClick} 
                    className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </nav>

            {/* Carousel Hero Section */}
            <header className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden group">
                 {activityImages.map((img, index) => (
                    <div
                        key={img.name}
                        className={`absolute top-0 left-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundImage: `url(${img.url})` }}
                        aria-hidden={index !== currentImageIndex}
                        role="img"
                        aria-label={img.name}
                    ></div>
                ))}
       
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4 z-10">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white animate-fade-in-down">
                        Tu Lugar Para el Deporte y la Amistad
                    </h2>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-up">
                        Únete a nuestra comunidad y descubre un espacio para crecer, competir y compartir.
                    </p>
                </div>

                {/* Carousel controls */}
                <button 
                    onClick={goToPrevious} 
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Imagen anterior"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={goToNext} 
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Siguiente imagen"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {activityImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Ir a la imagen ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </header>

            {/* Activities Section */}
            <main className="container mx-auto px-6 py-24">
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

            {/* Simple animations for hero text */}
            <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 1s ease-out forwards;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out 0.5s forwards;
                    opacity: 0; /* Start hidden for animation */
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
