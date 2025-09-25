import React, { useState, useEffect } from 'react';
import { Member, MemberCategory, CollectionZone, MemberStatus, MemberCategoryInfo } from '../../types';
import { mockApi } from '../../services/mockApi';

interface SocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  member: Member | null;
}

const SocioModal: React.FC<SocioModalProps> = ({ isOpen, onClose, onSave, member }) => {
  const initialFormState = {
    firstName: '',
    lastName: '',
    birthDate: '',
    categoryId: MemberCategory.ACTIVO_MASCULINO,
    collectionZone: CollectionZone.CLUB,
    status: MemberStatus.ACTIVE,
    activities: [],
    hasLocker: false,
    familyGroupId: undefined,
  };
  const [formData, setFormData] = useState<Omit<Member, 'id' | 'joinDate'>>(initialFormState);
  const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);

  useEffect(() => {
    mockApi.getMemberCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName,
        lastName: member.lastName,
        birthDate: member.birthDate,
        categoryId: member.categoryId,
        collectionZone: member.collectionZone,
        status: member.status,
        activities: member.activities,
        hasLocker: member.hasLocker,
        familyGroupId: member.familyGroupId,
      });
    } else {
      // Reset form for new member
      setFormData(initialFormState);
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData: Member = {
        ...formData,
        id: member ? member.id : 0, // ID will be set by mock API for new members
        joinDate: member ? member.joinDate : new Date().toISOString().split('T')[0],
        collectionZone: Number(formData.collectionZone),
        activities: formData.activities.map(Number)
    };
    onSave(memberData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-white">{member ? 'Editar Socio' : 'Nuevo Socio'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" className="input-style" required />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" className="input-style" required />
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="input-style" required />
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="input-style">
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <select name="collectionZone" value={formData.collectionZone} onChange={handleChange} className="input-style">
              {Object.entries(CollectionZone).filter(([key]) => isNaN(Number(key))).map(([key, value]) => (
                <option key={value} value={value}>{key}</option>
              ))}
            </select>
             <select name="status" value={formData.status} onChange={handleChange} className="input-style">
                {Object.values(MemberStatus).map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
            </select>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="hasLocker" name="hasLocker" checked={formData.hasLocker} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500" />
            <label htmlFor="hasLocker" className="ml-2 text-sm font-medium text-gray-300">Tiene Locker?</label>
          </div>
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
      {/* Fix: Removed non-standard 'jsx' prop from <style> tag to resolve TypeScript error. */}
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
        /* Custom styling for date picker icon */
        .input-style::-webkit-calendar-picker-indicator {
            filter: invert(1);
        }
      `}</style>
    </div>
  );
};

export default SocioModal;