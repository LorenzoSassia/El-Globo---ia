
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Socio } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Casilleros: React.FC = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [estaModalAbierto, setEstaModalAbierto] = useState(false);
    const [socioEnEdicion, setSocioEnEdicion] = useState<Socio | null>(null);
    
    // Estado del formulario del modal
    const [modalSocioSeleccionadoId, setModalSocioSeleccionadoId] = useState<string>('');
    const [modalNumeroCasillero, setModalNumeroCasillero] = useState<string>('');

    const cargarSocios = async () => {
        const datosSocios = await mockApi.getSocios();
        setSocios(datosSocios);
    };

    useEffect(() => {
        cargarSocios();
    }, []);

    const sociosConCasillero = socios.filter(m => m.tieneCasillero && m.numeroCasillero).sort((a,b) => (a.numeroCasillero || 0) - (b.numeroCasillero || 0));
    const sociosSinCasillero = socios.filter(m => !m.tieneCasillero);

    const abrirModal = (socio: Socio | null = null) => {
        setSocioEnEdicion(socio);
        if (socio) {
            setModalNumeroCasillero(socio.numeroCasillero?.toString() || '');
            setModalSocioSeleccionadoId(socio.id.toString());
        } else {
            setModalNumeroCasillero('');
            setModalSocioSeleccionadoId('');
        }
        setEstaModalAbierto(true);
    };

    const cerrarModal = () => {
        setEstaModalAbierto(false);
        setSocioEnEdicion(null);
    };

    const guardar = async () => {
        if (!modalSocioSeleccionadoId || !modalNumeroCasillero) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        const socioId = parseInt(modalSocioSeleccionadoId, 10);
        const numeroCasillero = parseInt(modalNumeroCasillero, 10);
        
        const socio = socios.find(m => m.id === socioId);
        if (socio) {
            const socioActualizado: Socio = { ...socio, tieneCasillero: true, numeroCasillero };
            await mockApi.updateSocio(socioActualizado);
            cargarSocios();
            cerrarModal();
        }
    };
    
    const liberarCasillero = async (socioId: number) => {
        if (window.confirm('¿Está seguro de que desea liberar este casillero?')) {
            const socio = socios.find(m => m.id === socioId);
            if (socio) {
                const socioActualizado: Socio = { ...socio, tieneCasillero: false, numeroCasillero: undefined };
                await mockApi.updateSocio(socioActualizado);
                cargarSocios();
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Casilleros</h1>
                <button onClick={() => abrirModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon />
                    <span className="ml-2">Asignar Casillero</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">N° Casillero</th>
                            <th scope="col" className="px-6 py-3">Socio</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sociosConCasillero.map((socio) => (
                            <tr key={socio.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{socio.numeroCasillero}</td>
                                <td className="px-6 py-4">{`${socio.nombre} ${socio.apellido}`}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => abrirModal(socio)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => liberarCasillero(socio.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {estaModalAbierto && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-white">{socioEnEdicion ? 'Editar Asignación' : 'Asignar Casillero'}</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="socio" className="block mb-2 text-sm font-medium text-gray-300">Socio</label>
                                {socioEnEdicion ? (
                                    <input type="text" value={`${socioEnEdicion.nombre} ${socioEnEdicion.apellido}`} className="w-full px-3 py-2 text-gray-400 bg-gray-700 border border-gray-600 rounded-md" disabled />
                                ) : (
                                    <select id="socio" value={modalSocioSeleccionadoId} onChange={(e) => setModalSocioSeleccionadoId(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Seleccione un socio</option>
                                        {sociosSinCasillero.map(m => (
                                            <option key={m.id} value={m.id}>{`${m.nombre} ${m.apellido}`}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lockerNumber" className="block mb-2 text-sm font-medium text-gray-300">Número de Casillero</label>
                                <input type="number" id="lockerNumber" value={modalNumeroCasillero} onChange={(e) => setModalNumeroCasillero(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 101" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 space-x-2">
                            <button type="button" onClick={cerrarModal} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button type="button" onClick={guardar} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Casilleros;
