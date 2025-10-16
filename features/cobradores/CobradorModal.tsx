import React, { useState, useEffect } from 'react';
import { Cobrador, Zona } from '../../types';
import { api } from '../../services/api';

interface CobradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cobrador: Omit<Cobrador, 'id'>) => void;
  cobrador: Cobrador | null;
}

const CobradorModal: React.FC<CobradorModalProps> = ({ isOpen, onClose, onSave, cobrador }) => {
  const initialFormState = {
    nombre: '',
    zonas_id: 0,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [zonas, setZonas] = useState<Zona[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.getZonas().then(zonasData => setZonas(zonasData as Zona[]));
      if (cobrador) {
        setFormData({
          nombre: cobrador.nombre,
          zonas_id: cobrador.zonas_id,
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [cobrador, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'zonas_id' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zonas_id) {
        alert("Por favor, seleccione una zona.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white">{cobrador ? 'Editar Cobrador' : 'Nuevo Cobrador'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del Cobrador"
            className="input-style"
            required
          />
          <select name="zonas_id" value={formData.zonas_id} onChange={handleChange} className="input-style" required>
            <option value={0}>Seleccione una Zona</option>
            {zonas.map(z => <option key={z.id} value={z.id}>{z.zona}</option>)}
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

export default CobradorModal;