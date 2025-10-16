import React, { useState, useEffect } from 'react';
import { Casillero } from '../../types';

interface CasilleroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (casillero: Omit<Casillero, 'id' | 'socio' | 'estado'>) => void;
  casillero: Casillero | null;
}

const CasilleroModal: React.FC<CasilleroModalProps> = ({ isOpen, onClose, onSave, casillero }) => {
  const initialFormState = {
    nro_casillero: 0,
    monto_mensual: 0,
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (casillero) {
      setFormData({
        nro_casillero: casillero.nro_casillero,
        monto_mensual: casillero.monto_mensual,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [casillero, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.nro_casillero <= 0) {
        alert("El número de casillero debe ser mayor a cero.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white">{casillero ? 'Editar Casillero' : 'Nuevo Casillero'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="number"
            name="nro_casillero"
            value={formData.nro_casillero}
            onChange={handleChange}
            placeholder="Número de Casillero"
            className="input-style"
            required
          />
          <input
            type="number"
            name="monto_mensual"
            value={formData.monto_mensual}
            onChange={handleChange}
            placeholder="Monto Mensual"
            className="input-style"
            required
          />
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

export default CasilleroModal;