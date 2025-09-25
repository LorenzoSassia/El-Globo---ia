
import React, { useState, useEffect } from 'react';
import { Member, MemberCategoryInfo, Activity, MemberStatus } from '../../types';
import { mockApi } from '../../services/mockApi';

interface SocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member | Omit<Member, 'id'>) => void;
  member: Member | null;
}

const SocioModal: React.FC<SocioModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    birthDate: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: MemberStatus.ACTIVE,
    categoryId: '',
    activities: [] as number[],
    hasLocker: false,
  };
  
  const [formData, setFormData] = useState<Omit<Member, 'id'>>(initialFormState);
  const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (isOpen) {
      mockApi.getMemberCategories().then(setCategories);
      mockApi.getActivities().then(setAllActivities);
      if (member) {
        setFormData({
          firstName: member.firstName,
          lastName: member.lastName,
          birthDate: member.birthDate,
          joinDate: member.joinDate,
          status: member.status,
          categoryId: member.categoryId,
          activities: [...member.activities],
          hasLocker: member.hasLocker,
        });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleActivityChange = (activityId: number) => {
      setFormData(prev => {
          const newActivities = prev.activities.includes(activityId)
            ? prev.activities.filter(id => id !== activityId)
            : [...prev.activities, activityId];
          return { ...prev, activities: newActivities };
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (member) {
        onSave({ ...formData, id: member.id });
    } else {
        onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white">{member ? 'Editar Socio' : 'Nuevo Socio'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" className="input-style" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" className="input-style" required />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="Fecha de Nacimiento" className="input-style" required />
            <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} placeholder="Fecha de Ingreso" className="input-style" required />
            <select name="status" value={formData.status} onChange={handleChange} className="input-style">
              {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input-style" required>
              <option value="">Seleccione Categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Actividades</label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-700 rounded-md md:grid-cols-3">
              {allActivities.map(act => (
                <label key={act.id} className="flex items-center space-x-2 text-white">
                  <input type="checkbox" checked={formData.activities.includes(act.id)} onChange={() => handleActivityChange(act.id)} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"/>
                  <span>{act.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center">
             <input type="checkbox" name="hasLocker" checked={formData.hasLocker} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500" />
             <label className="ml-2 text-white">Tiene Locker?</label>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
        <style>{`.input-style { width: 100%; padding: 0.75rem; color: white; background-color: #374151; border: 1px solid #4B5563; border-radius: 0.375rem; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3B82F6; }`}</style>
      </div>
    </div>
  );
};

export default SocioModal;
