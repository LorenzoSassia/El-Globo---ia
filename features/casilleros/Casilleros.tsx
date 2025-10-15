import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Socio, Casillero } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Casilleros: React.FC = () => {
    const [casilleros, setCasilleros] = useState<Casillero[]>([]);
    const [socios, setSocios] = useState<Socio[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCasillero, setEditingCasillero] = useState<Casillero | null>(null);
    
    // Estado del formulario del modal
    const [idSocioSeleccionado, setIdSocioSeleccionado] = useState<string>('');

    const cargarDatos = async () => {
        try {
            const [casillerosData, sociosData] = await Promise.all([api.getCasilleros(), api.getSocios()]);
            const casillerosConSocio = (casillerosData as Casillero[]).map(cas => {
                const socio = (sociosData as Socio[]).find(s => s.casilleros_id === cas.id);
                return { ...cas, socio };
            });
            setCasilleros(casillerosConSocio);
            setSocios(sociosData as Socio[]);
        } catch (error) {
            console.error("Error al cargar datos de casilleros:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const sociosSinCasillero = socios.filter(s => !s.casilleros_id);

    const handleAbrirModal = (casillero: Casillero) => {
        setEditingCasillero(casillero);
        setIdSocioSeleccionado(casillero.socio?.id.toString() || '');
        setIsModalOpen(true);
    };

    const handleCerrarModal = () => {
        setIsModalOpen(false);
        setEditingCasillero(null);
    };

    const handleGuardar = async () => {
        if (!editingCasillero || !idSocioSeleccionado) {
            alert('Por favor, seleccione un socio.');
            return;
        }
        
        try {
            const socioId = parseInt(idSocioSeleccionado, 10);
            // Asignar el casillero al nuevo socio
            await api.updateSocio(socioId, { casilleros_id: editingCasillero.id });
            // Marcar el casillero como ocupado
            await api.updateCasillero(editingCasillero.id, { estado: 'Ocupado' });
            
            cargarDatos();
            handleCerrarModal();
        } catch (error) {
            console.error("Error al asignar casillero:", error);
            alert("No se pudo asignar el casillero.");
        }
    };
    
    const handleLiberarCasillero = async (casillero: Casillero) => {
        if (window.confirm('¿Está seguro de que desea liberar este casillero?')) {
            if (!casillero.socio) return;
            try {
                // Quitar la asignación del casillero al socio
                await api.updateSocio(casillero.socio.id, { casilleros_id: null });
                // Marcar el casillero como libre
                await api.updateCasillero(casillero.id, { estado: 'Libre' });
                cargarDatos();
            } catch (error) {
                console.error("Error al liberar casillero:", error);
                alert("No se pudo liberar el casillero.");
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Casilleros</h1>
                {/* Botón de "Nuevo" no es necesario si la lista de casilleros es fija */}
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">N° Casillero</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Socio Asignado</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {casilleros.map((casillero) => (
                            <tr key={casillero.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{casillero.nro_casillero}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${casillero.estado === 'Ocupado' ? 'bg-yellow-600 text-yellow-100' : 'bg-green-600 text-green-100'}`}>
                                        {casillero.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{casillero.socio ? `${casillero.socio.nombre} ${casillero.socio.apellido}` : '---'}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    {casillero.estado === 'Libre' ? (
                                        <button onClick={() => handleAbrirModal(casillero)} className="text-blue-500 hover:text-blue-400"><PlusIcon /></button>
                                    ) : (
                                        <button onClick={() => handleLiberarCasillero(casillero)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Asignación */}
            {isModalOpen && editingCasillero && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-white">Asignar Casillero N° {editingCasillero.nro_casillero}</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="socio" className="block mb-2 text-sm font-medium text-gray-300">Socio a Asignar</label>
                                <select id="socio" value={idSocioSeleccionado} onChange={(e) => setIdSocioSeleccionado(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Seleccione un socio</option>
                                    {sociosSinCasillero.map(s => (
                                        <option key={s.id} value={s.id}>{`${s.nombre} ${s.apellido}`}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 space-x-2">
                            <button type="button" onClick={handleCerrarModal} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button type="button" onClick={handleGuardar} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Asignar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Casilleros;
