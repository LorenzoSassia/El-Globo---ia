

import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Socio, Actividad, Categoria } from '../../types';
import SocioModal from './SocioModal';
import SocioInfoModal from './SocioInfoModal';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Socios: React.FC = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [sociosData, actividadesData, categoriasData] = await Promise.all([
                api.getSocios(),
                api.getActividades(),
                api.getCategorias()
            ]);
            setSocios(sociosData as Socio[]);
            setActividades(actividadesData as Actividad[]);
            setCategorias(categoriasData as Categoria[]);
        } catch (error) {
            console.error("Error al cargar datos de socios:", error);
            alert("No se pudieron cargar los datos. Verifique la conexión con la API.");
        }
    };

    const handleAbrirModalEditar = (socio: Socio | null = null) => {
        setSocioSeleccionado(socio);
        setIsEditModalOpen(true);
    };

    const handleAbrirModalInfo = (socio: Socio) => {
        setSocioSeleccionado(socio);
        setIsInfoModalOpen(true);
    };
    
    const handleCerrarModales = () => {
        setIsEditModalOpen(false);
        setIsInfoModalOpen(false);
        setSocioSeleccionado(null);
    };

    const handleGuardarSocio = async (socioData: Omit<Socio, 'id'> | Socio) => {
        try {
            if ('id' in socioData && socioData.id) {
                await api.updateSocio(socioData.id, socioData);
            } else {
                await api.addSocio(socioData);
            }
            cargarDatos();
            handleCerrarModales();
        } catch (error) {
            console.error("Error al guardar socio:", error);
            alert("Error al guardar el socio.");
        }
    };

    const handleEliminarSocio = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este socio?')) {
            try {
                await api.deleteSocio(id);
                cargarDatos();
            } catch (error) {
                console.error("Error al eliminar socio:", error);
                alert("Error al eliminar el socio.");
            }
        }
    };
    
    const getNombreCategoria = (id: number) => categorias.find(c => c.id === id)?.nombre || 'N/A';

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Socios</h1>
                <button onClick={() => handleAbrirModalEditar()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon />
                    <span className="ml-2">Nuevo Socio</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Categoría</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {socios.map((socio) => (
                            <tr key={socio.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4">{socio.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{`${socio.nombre} ${socio.apellido}`}</td>
                                <td className="px-6 py-4">{getNombreCategoria(socio.categorias_id)}</td>
                                <td className="px-6 py-4">{socio.status}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => handleAbrirModalInfo(socio)} className="text-gray-400 hover:text-white"><EyeIcon /></button>
                                    <button onClick={() => handleAbrirModalEditar(socio)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => handleEliminarSocio(socio.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SocioModal
                isOpen={isEditModalOpen}
                onClose={handleCerrarModales}
                onSave={handleGuardarSocio}
                socio={socioSeleccionado}
            />
            
            <SocioInfoModal
                isOpen={isInfoModalOpen}
                onClose={handleCerrarModales}
                socio={socioSeleccionado}
                actividades={actividades}
                categorias={categorias}
            />
        </div>
    );
};

export default Socios;
