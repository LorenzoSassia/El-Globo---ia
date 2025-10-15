
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Socio, Actividad, InfoCategoriaSocio } from '../../types';
import SocioModal from './SocioModal';
import SocioInfoModal from './SocioInfoModal';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Socios: React.FC = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<InfoCategoriaSocio[]>([]);
    const [estaModalEdicionAbierto, setEstaModalEdicionAbierto] = useState(false);
    const [estaModalInfoAbierto, setEstaModalInfoAbierto] = useState(false);
    const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        const [datosSocios, datosActividades, datosCategorias] = await Promise.all([
            mockApi.getSocios(),
            mockApi.getActividades(),
            mockApi.getCategoriasSocios()
        ]);
        setSocios(datosSocios);
        setActividades(datosActividades);
        setCategorias(datosCategorias);
    };

    const abrirModalEdicion = (socio: Socio | null = null) => {
        setSocioSeleccionado(socio);
        setEstaModalEdicionAbierto(true);
    };

    const abrirModalInfo = (socio: Socio) => {
        setSocioSeleccionado(socio);
        setEstaModalInfoAbierto(true);
    };
    
    const cerrarModales = () => {
        setEstaModalEdicionAbierto(false);
        setEstaModalInfoAbierto(false);
        setSocioSeleccionado(null);
    };

    const guardarSocio = async (socio: Socio | Omit<Socio, 'id'>) => {
        if ('id' in socio && socio.id) {
            await mockApi.updateSocio(socio as Socio);
        } else {
            await mockApi.addSocio(socio);
        }
        cargarDatos();
        cerrarModales();
    };

    const eliminarSocio = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este socio?')) {
            await mockApi.deleteSocio(id);
            cargarDatos();
        }
    };
    
    const obtenerNombreCategoria = (id: string) => categorias.find(c => c.id === id)?.nombre || 'N/A';

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Socios</h1>
                <button onClick={() => abrirModalEdicion()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
                                <td className="px-6 py-4">{obtenerNombreCategoria(socio.categoriaId)}</td>
                                <td className="px-6 py-4">{socio.estado}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => abrirModalInfo(socio)} className="text-gray-400 hover:text-white"><EyeIcon /></button>
                                    <button onClick={() => abrirModalEdicion(socio)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => eliminarSocio(socio.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SocioModal
                estaAbierto={estaModalEdicionAbierto}
                alCerrar={cerrarModales}
                alGuardar={guardarSocio}
                socio={socioSeleccionado}
            />
            
            <SocioInfoModal
                estaAbierto={estaModalInfoAbierto}
                alCerrar={cerrarModales}
                socio={socioSeleccionado}
                actividades={actividades}
                categorias={categorias}
            />
        </div>
    );
};

export default Socios;
