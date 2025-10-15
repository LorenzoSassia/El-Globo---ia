import React, { useState, useEffect } from 'react';
import { Actividad, Socio } from '../../types';
import { api } from '../../services/api';
import ActividadModal from './ActividadModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';

const Actividades: React.FC = () => {
  const { usuario } = useAuth();
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividad | null>(null);
  const [socioActual, setSocioActual] = useState<Socio | null>(null);

  useEffect(() => {
    cargarActividades();
    cargarDatosSocio();
  }, [usuario]);

  const cargarActividades = async () => {
    try {
        const data = await api.getActividades();
        setActividades(data as Actividad[]);
    } catch (error) {
        console.error("Error al cargar actividades:", error);
    }
  };

  const cargarDatosSocio = async () => {
      if (usuario?.rol === 'socio' && usuario.socioId) {
          try {
              const socioData = await api.getSocio(usuario.socioId);
              setSocioActual(socioData as Socio || null);
          } catch (error) {
              console.error("Error al cargar datos del socio:", error);
          }
      }
  };
  
  const handleAlternarInscripcion = async (actividadId: number) => {
      if (!socioActual) return;
      
      const isEnrolled = socioActual.actividades?.some(a => a.id === actividadId);
      
      try {
        if (isEnrolled) {
            await api.desinscribirSocioActividad(socioActual.id, actividadId);
        } else {
            await api.inscribirSocioActividad(socioActual.id, actividadId);
        }
        // Recargar datos del socio para reflejar el cambio
        cargarDatosSocio();
      } catch (error) {
          console.error("Error al cambiar la inscripción:", error);
          alert("No se pudo actualizar la inscripción.");
      }
  };

  const handleAbrirModal = (actividad: Actividad | null = null) => {
    setActividadSeleccionada(actividad);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setActividadSeleccionada(null);
  };

  const handleGuardarActividad = async (actividad: Omit<Actividad, 'id'>) => {
    try {
        if (actividadSeleccionada) {
            await api.updateActividad(actividadSeleccionada.id, actividad);
        } else {
            await api.addActividad(actividad);
        }
        cargarActividades();
        handleCerrarModal();
    } catch (error) {
        console.error("Error al guardar actividad:", error);
        alert("Error al guardar la actividad.");
    }
  };

  const handleEliminarActividad = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      try {
        await api.deleteActividad(id);
        cargarActividades();
      } catch (error) {
          console.error("Error al eliminar actividad:", error);
          alert("Error al eliminar la actividad.");
      }
    }
  };

  const isAdmin = usuario?.rol === 'admin';
  const isSocio = usuario?.rol === 'socio';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Actividades del Club</h1>
        {isAdmin && (
            <button onClick={() => handleAbrirModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
              <th scope="col" className="px-6 py-3">Turno</th>
              {(isAdmin || isSocio) && <th scope="col" className="px-6 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {actividades.map((actividad) => (
              <tr key={actividad.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{actividad.id}</td>
                <td className="px-6 py-4 text-white">{actividad.nombre}</td>
                <td className="px-6 py-4">${actividad.costo.toLocaleString()}</td>
                <td className="px-6 py-4 capitalize">{actividad.turno}</td>
                {(isAdmin || isSocio) && (
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            {isAdmin && (
                                <>
                                <button onClick={() => handleAbrirModal(actividad)} className="text-blue-500 hover:text-blue-400"><PencilIcon/></button>
                                <button onClick={() => handleEliminarActividad(actividad.id)} className="text-red-500 hover:text-red-400"><TrashIcon/></button>
                                </>
                            )}
                            {isSocio && socioActual && (
                                <button 
                                    onClick={() => handleAlternarInscripcion(actividad.id)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        socioActual.actividades?.some(a => a.id === actividad.id)
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {socioActual.actividades?.some(a => a.id === actividad.id) ? 'Darse de baja' : 'Inscribirse'}
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
      
      {isAdmin && <ActividadModal
        isOpen={isModalOpen}
        onClose={handleCerrarModal}
        onSave={handleGuardarActividad}
        actividad={actividadSeleccionada}
      />}
    </div>
  );
};

export default Actividades;
