
import React, { useState, useEffect } from 'react';
import { Actividad } from '../../types';

interface ActividadModalProps {
  estaAbierto: boolean;
  alCerrar: () => void;
  alGuardar: (actividad: Actividad) => void;
  actividad: Actividad | null;
}

const ActividadModal: React.FC<ActividadModalProps> = ({ estaAbierto, alCerrar, alGuardar, actividad }) => {
  const estadoInicialFormulario = {
    nombre: '',
    costo: 0,
    horario: 'matutino' as 'matutino' | 'vespertino' | 'nocturno',
  };
  const [datosFormulario, setDatosFormulario] = useState<Omit<Actividad, 'id'>>(estadoInicialFormulario);

  useEffect(() => {
    if (actividad) {
      setDatosFormulario({
        nombre: actividad.nombre,
        costo: actividad.costo,
        horario: actividad.horario,
      });
    } else {
      setDatosFormulario(estadoInicialFormulario);
    }
  }, [actividad, estaAbierto]);

  if (!estaAbierto) return null;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({ ...prev, [name]: name === 'costo' ? Number(value) : value }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datosActividad: Actividad = {
      ...datosFormulario,
      id: actividad ? actividad.id : 0,
    };
    alGuardar(datosActividad);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white">{actividad ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
        <form onSubmit={manejarSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambio}
            placeholder="Nombre de la Actividad"
            className="input-style"
            required
          />
          <input
            type="number"
            name="costo"
            value={datosFormulario.costo}
            onChange={manejarCambio}
            placeholder="Costo"
            className="input-style"
            required
          />
          <select name="horario" value={datosFormulario.horario} onChange={manejarCambio} className="input-style">
            <option value="matutino">Matutino</option>
            <option value="vespertino">Vespertino</option>
            <option value="nocturno">Nocturno</option>
          </select>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={alCerrar} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
      <style>{`
        .input-style {
            width: 100%;
            padding: 0.75rem;
            color: white;
            background-color: #374151; /* gray-700 */
            border: 1px solid #4B5563; /* gray-600 */
            border-radius: 0.375rem;
        }
        .input-style:focus {
            outline: none;
            box-shadow: 0 0 0 2px #3B82F6; /* focus:ring-blue-500 */
        }
      `}</style>
    </div>
  );
};

export default ActividadModal;
