
import React from 'react';
import { Socio, Actividad, Categoria } from '../../types';

interface SocioInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  socio: Socio | null;
  actividades: Actividad[];
  categorias: Categoria[];
}

const SocioInfoModal: React.FC<SocioInfoModalProps> = ({ isOpen, onClose, socio, actividades, categorias }) => {
  if (!isOpen || !socio) return null;

  const getNombreCategoria = (id: number) => categorias.find(c => c.id === id)?.nombre || 'Desconocida';
  const actividadesSocio = socio.actividades || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">Detalles del Socio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="mt-4 text-gray-300">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p><strong>ID:</strong> {socio.id}</p>
                <p><strong>Nombre:</strong> {`${socio.nombre} ${socio.apellido}`}</p>
                <p><strong>Fecha de Ingreso:</strong> {socio.fecha_alta}</p>
                <p><strong>Fecha de Nacimiento:</strong> {socio.fecha_nacimiento}</p>
                <p><strong>Categoría:</strong> {getNombreCategoria(socio.categorias_id)}</p>
                <p><strong>Estado:</strong> <span className={`font-semibold ${socio.status === 'Pago' ? 'text-green-400' : 'text-yellow-400'}`}>{socio.status.toUpperCase()}</span></p>
                <p><strong>Casillero ID:</strong> {socio.casilleros_id || 'No asignado'}</p>
                <p><strong>DNI:</strong> {socio.dni}</p>
                <p><strong>Email:</strong> {socio.email}</p>
                <p><strong>Teléfono:</strong> {socio.telefono}</p>
                <p className="md:col-span-2"><strong>Dirección:</strong> {socio.direccion}</p>
           </div>
           <div className="pt-4 mt-4 border-t border-gray-700">
                <h3 className="font-semibold text-white">Actividades Inscritas</h3>
                {actividadesSocio.length > 0 ? (
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        {actividadesSocio.map(act => <li key={act.id}>{act.nombre}</li>)}
                    </ul>
                ) : (
                    <p>Ninguna</p>
                )}
           </div>
        </div>
        <div className="flex justify-end pt-4 mt-4">
            <button onClick={onClose} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default SocioInfoModal;
