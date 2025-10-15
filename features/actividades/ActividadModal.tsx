import React, { useState, useEffect } from 'react';
import { Actividad } from '../../types';

interface ActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Actividad, 'id'>) => void;
  actividad: Actividad | null;
}

const ActividadModal: React.FC<ActividadModalProps> = ({ isOpen, onClose, onSave, actividad }) => {
  const initialFormState = {
    nombre: '',
    costo: 0,
    turno: 'Mañana',
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (actividad) {
      setFormData({
        nombre: actividad.nombre,
        costo: actividad.costo,
        turno: actividad.turno,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [actividad, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'costo' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white">{actividad ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre de la Actividad"
            className="input-style"
            required
          />
          <input
            type="number"
            name="costo"
            value={formData.costo}
            onChange={handleChange}
            placeholder="Costo"
            className="input-style"
            required
          />
          <select name="turno" value={formData.turno} onChange={handleChange} className="input-style">
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
            <option value="Mañana - Tarde">Mañana - Tarde</option>
          </select>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
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
