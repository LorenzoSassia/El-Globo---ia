import React, { useState, useEffect } from 'react';
import { Cobrador, Zona } from '../../types';
import { api } from '../../services/api';
import CobradorModal from './CobradorModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Cobradores: React.FC = () => {
    const [cobradores, setCobradores] = useState<Cobrador[]>([]);
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cobradorSeleccionado, setCobradorSeleccionado] = useState<Cobrador | null>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [cobradoresData, zonasData] = await Promise.all([
                api.getCobradores(),
                api.getZonas()
            ]);
            setCobradores(cobradoresData as Cobrador[]);
            setZonas(zonasData as Zona[]);
        } catch (error) {
            console.error("Error al cargar datos de cobradores:", error);
            alert("No se pudieron cargar los datos.");
        }
    };
    
    const getNombreZona = (id: number) => zonas.find(z => z.id === id)?.zona || 'N/A';

    const handleAbrirModal = (cobrador: Cobrador | null = null) => {
        setCobradorSeleccionado(cobrador);
        setIsModalOpen(true);
    };

    const handleCerrarModal = () => {
        setIsModalOpen(false);
        setCobradorSeleccionado(null);
    };

    const handleGuardarCobrador = async (cobradorData: Omit<Cobrador, 'id'>) => {
        try {
            if (cobradorSeleccionado) {
                await api.updateCobrador(cobradorSeleccionado.id, cobradorData);
            } else {
                await api.addCobrador(cobradorData);
            }
            cargarDatos();
            handleCerrarModal();
        } catch (error) {
            console.error("Error al guardar cobrador:", error);
            alert("Error al guardar el cobrador.");
        }
    };

    const handleEliminarCobrador = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este cobrador?')) {
            try {
                await api.deleteCobrador(id);
                cargarDatos();
            } catch (error) {
                console.error("Error al eliminar cobrador:", error);
                alert("Error al eliminar el cobrador.");
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Cobradores</h1>
                <button onClick={() => handleAbrirModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon />
                    <span className="ml-2">Nuevo Cobrador</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Zona Asignada</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cobradores.map((cobrador) => (
                            <tr key={cobrador.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4">{cobrador.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{cobrador.nombre}</td>
                                <td className="px-6 py-4">{getNombreZona(cobrador.zonas_id)}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => handleAbrirModal(cobrador)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => handleEliminarCobrador(cobrador.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <CobradorModal
                isOpen={isModalOpen}
                onClose={handleCerrarModal}
                onSave={handleGuardarCobrador}
                cobrador={cobradorSeleccionado}
            />
        </div>
    );
};

export default Cobradores;