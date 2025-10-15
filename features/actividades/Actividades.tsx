
import React, { useState, useEffect } from 'react';
import { Actividad, Socio } from '../../types';
import { mockApi } from '../../services/mockApi';
import ActividadModal from './ActividadModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import { RolUsuario } from '../../types';

const Actividades: React.FC = () => {
  const { usuario } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [estaModalAbierto, setEstaModalAbierto] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [socioActual, setSocioActual] = useState<Socio | null>(null);

  useEffect(() => {
    cargarActividades();
    cargarDatosSocio();
  }, [usuario]);

  const cargarActividades = async () => {
    const data = await mockApi.getActividades();
    setActividades(data);
  };

  const cargarDatosSocio = async () => {
      if (usuario?.rol === RolUsuario.SOCIO && usuario.socioId) {
          const datosSocio = await mockApi.getSocio(usuario.socioId);
          setSocioActual(datosSocio || null);
      }
  };
  
  const alternarInscripcion = async (actividadId: number) => {
      if (!socioActual) return;
      
      const estaInscrito = socioActual.actividades.includes(actividadId);
      const actividadesActualizadas = estaInscrito
          ? socioActual.actividades.filter(id => id !== actividadId)
          : [...socioActual.actividades, actividadId];
          
      const socioActualizado = { ...socioActual, actividades: actividadesActualizadas };
      
      await mockApi.updateSocio(socioActualizado);
      setSocioActual(socioActualizado);
  };

  const abrirModal = (actividad: Actividad | null = null) => {
    setActividadSeleccionada(actividad);
    setEstaModalAbierto(true);
  };

  const cerrarModal = () => {
    setEstaModalAbierto(false);
    setActividadSeleccionada(null);
  };

  const guardarActividad = async (actividad: Actividad) => {
    if (actividadSeleccionada) {
      await mockApi.updateActividad({ ...actividad, id: actividadSeleccionada.id });
    } else {
      await mockApi.addActividad(actividad);
    }
    cargarActividades();
    cerrarModal();
  };

  const eliminarActividad = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      await mockApi.deleteActividad(id);
      cargarActividades();
    }
  };

  const esAdmin = usuario?.rol === RolUsuario.ADMIN;
  const esSocio = usuario?.rol === RolUsuario.SOCIO;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Actividades del Club</h1>
        {esAdmin && (
            <button onClick={() => abrirModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <PlusIcon />
                <span className="ml-2">Nueva Actividad</span>
            </button>
        )}
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Costo</th>
              <th scope="col" className="px-6 py-3">Horario</th>
              {(esAdmin || esSocio) && <th scope="col" className="px-6 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => (
              <tr key={actividad.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{actividad.id}</td>
                <td className="px-6 py-4 text-white">{actividad.nombre}</td>
                <td className="px-6 py-4">${actividad.costo.toLocaleString()}</td>
                <td className="px-6 py-4 capitalize">{actividad.horario}</td>
                {(esAdmin || esSocio) && (
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            {esAdmin && (
                                <>
                                <button onClick={() => abrirModal(actividad)} className="text-blue-500 hover:text-blue-400"><PencilIcon/></button>
                                <button onClick={() => eliminarActividad(actividad.id)} className="text-red-500 hover:text-red-400"><TrashIcon/></button>
                                </>
                            )}
                            {esSocio && socioActual && (
                                <button 
                                    onClick={() => alternarInscripcion(actividad.id)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        socioActual.actividades.includes(actividad.id)
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {socioActual.actividades.includes(actividad.id) ? 'Darse de baja' : 'Inscribirse'}
                                </button>
                            )}
                        </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {esAdmin && <ActividadModal
        estaAbierto={estaModalAbierto}
        alCerrar={cerrarModal}
        alGuardar={guardarActividad}
        actividad={actividadSeleccionada}
      />}
    </div>
  );
};

export default Actividades;
