
import React from 'react';
import { Member, Activity, MemberCategoryInfo } from '../../types';

interface SocioInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
  activities: Activity[];
  categories: MemberCategoryInfo[];
}

const SocioInfoModal: React.FC<SocioInfoModalProps> = ({ isOpen, onClose, member, activities, categories }) => {
  if (!isOpen || !member) return null;

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Desconocida';
  const memberActivities = activities.filter(a => member.activities.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-white">Detalles del Socio</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="mt-4 text-gray-300">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <p><strong>ID:</strong> {member.id}</p>
                <p><strong>Nombre:</strong> {`${member.firstName} ${member.lastName}`}</p>
                <p><strong>Fecha de Ingreso:</strong> {member.joinDate}</p>
                <p><strong>Fecha de Nacimiento:</strong> {member.birthDate}</p>
                <p><strong>Categoría:</strong> {getCategoryName(member.categoryId)}</p>
                <p><strong>Estado:</strong> <span className={`font-semibold ${member.status === 'activo' ? 'text-green-400' : 'text-yellow-400'}`}>{member.status.toUpperCase()}</span></p>
                <p><strong>Locker:</strong> {member.hasLocker ? `Sí (N° ${member.lockerNumber || 'N/A'})` : 'No'}</p>
           </div>
           <div className="pt-4 mt-4 border-t border-gray-700">
                <h3 className="font-semibold text-white">Actividades Inscritas</h3>
                {memberActivities.length > 0 ? (
                    <ul className="mt-2 space-y-1 list-disc list-inside">
                        {memberActivities.map(act => <li key={act.id}>{act.name}</li>)}
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