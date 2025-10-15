import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Socio, Actividad, Categoria } from '../../types';

const MiPerfil: React.FC = () => {
    const { usuario } = useAuth();
    const [datosSocio, setDatosSocio] = useState<Socio | null>(null);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            if (usuario?.socioId) {
                try {
                    const [socio, todasLasCategorias] = await Promise.all([
                        api.getSocio(usuario.socioId),
                        api.getCategorias()
                    ]);
                    setDatosSocio(socio as Socio || null);
                    // Las actividades vienen dentro del objeto socio desde el backend
                    setActividades((socio as Socio).actividades || []);
                    setCategorias(todasLasCategorias as Categoria[]);
                } catch (error) {
                    console.error("Error al cargar los datos del perfil", error);
                }
            }
            setLoading(false);
        };
        cargarPerfil();
    }, [usuario]);

    if (loading) {
        return <p className="text-center text-gray-400">Cargando perfil...</p>;
    }

    if (!datosSocio) {
        return <p className="text-center text-red-500">No se pudo encontrar la información del socio.</p>;
    }
    
    const getNombreCategoria = (id: number) => categorias.find(c => c.id === id)?.nombre || 'Desconocida';

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Mi Perfil de Socio</h1>
            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{datosSocio.nombre} {datosSocio.apellido}</h2>
                        <p className="text-gray-400">Socio N°: {datosSocio.id}</p>
                    </div>
                     <div className="md:text-right">
                        <p className="text-lg">Estado: <span className={`font-semibold ${datosSocio.status === 'Pago' ? 'text-green-400' : 'text-yellow-400'}`}>{datosSocio.status.toUpperCase()}</span></p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Fecha de Nacimiento:</p>
                        <p>{datosSocio.fecha_nacimiento}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Fecha de Ingreso:</p>
                        <p>{datosSocio.fecha_alta}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Categoría:</p>
                        <p>{getNombreCategoria(datosSocio.categorias_id)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Casillero:</p>
                        <p>{datosSocio.casilleros_id ? `Sí (N° ${datosSocio.casilleros_id})` : 'No'}</p>
                    </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Actividades Inscritas</h3>
                    {actividades.length > 0 ? (
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            {actividades.map(actividad => (
                                <li key={actividad.id} className="text-gray-300">{actividad.nombre} - ${actividad.costo}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-gray-400">No estás inscripto en ninguna actividad.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
