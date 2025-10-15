
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { Socio, Actividad, InfoCategoriaSocio } from '../../types';

const MiPerfil: React.FC = () => {
    const { usuario } = useAuth();
    const [datosSocio, setDatosSocio] = useState<Socio | null>(null);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<InfoCategoriaSocio[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarPerfil = async () => {
            if (usuario?.socioId) {
                try {
                    const [socio, todasLasActividades, todasLasCategorias] = await Promise.all([
                        mockApi.getSocio(usuario.socioId),
                        mockApi.getActividades(),
                        mockApi.getCategoriasSocios()
                    ]);
                    setDatosSocio(socio || null);
                    setActividades(todasLasActividades);
                    setCategorias(todasLasCategorias);
                } catch (error) {
                    console.error("Falló la carga de datos del perfil", error);
                }
            }
            setCargando(false);
        };
        cargarPerfil();
    }, [usuario]);

    if (cargando) {
        return <p className="text-center text-gray-400">Cargando perfil...</p>;
    }

    if (!datosSocio) {
        return <p className="text-center text-red-500">No se pudo encontrar la información del socio.</p>;
    }
    
    const obtenerNombreCategoria = (id: string) => categorias.find(c => c.id === id)?.nombre || 'Desconocida';
    const actividadesSocio = actividades.filter(a => datosSocio.actividades.includes(a.id));

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
                        <p className="text-lg">Estado: <span className={`font-semibold ${datosSocio.estado === 'activo' ? 'text-green-400' : 'text-yellow-400'}`}>{datosSocio.estado.toUpperCase()}</span></p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Fecha de Nacimiento:</p>
                        <p>{datosSocio.fechaNacimiento}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Fecha de Ingreso:</p>
                        <p>{datosSocio.fechaIngreso}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Categoría:</p>
                        <p>{obtenerNombreCategoria(datosSocio.categoriaId)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Locker:</p>
                        <p>{datosSocio.tieneCasillero ? 'Sí' : 'No'}</p>
                    </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Actividades Inscritas</h3>
                    {actividadesSocio.length > 0 ? (
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            {actividadesSocio.map(actividad => (
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
