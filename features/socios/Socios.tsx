
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Member, Activity, MemberCategoryInfo } from '../../types';
import SocioModal from './SocioModal';
import SocioInfoModal from './SocioInfoModal';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Socios: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [membersData, activitiesData, categoriesData] = await Promise.all([
            mockApi.getMembers(),
            mockApi.getActivities(),
            mockApi.getMemberCategories()
        ]);
        setMembers(membersData);
        setActivities(activitiesData);
        setCategories(categoriesData);
    };

    const handleOpenEditModal = (member: Member | null = null) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const handleOpenInfoModal = (member: Member) => {
        setSelectedMember(member);
        setIsInfoModalOpen(true);
    };
    
    const handleCloseModals = () => {
        setIsEditModalOpen(false);
        setIsInfoModalOpen(false);
        setSelectedMember(null);
    };

    const handleSaveMember = async (member: Member | Omit<Member, 'id'>) => {
        if ('id' in member && member.id) {
            await mockApi.updateMember(member as Member);
        } else {
            await mockApi.addMember(member);
        }
        loadData();
        handleCloseModals();
    };

    const handleDeleteMember = async (id: number) => {
        if (window.confirm('¿Está seguro de que desea eliminar este socio?')) {
            await mockApi.deleteMember(id);
            loadData();
        }
    };
    
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'N/A';

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Socios</h1>
                <button onClick={() => handleOpenEditModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon />
                    <span className="ml-2">Nuevo Socio</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Categoría</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4">{member.id}</td>
                                <td className="px-6 py-4 font-medium text-white">{`${member.firstName} ${member.lastName}`}</td>
                                <td className="px-6 py-4">{getCategoryName(member.categoryId)}</td>
                                <td className="px-6 py-4">{member.status}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => handleOpenInfoModal(member)} className="text-gray-400 hover:text-white"><EyeIcon /></button>
                                    <button onClick={() => handleOpenEditModal(member)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => handleDeleteMember(member.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SocioModal
                isOpen={isEditModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveMember}
                member={selectedMember}
            />
            
            <SocioInfoModal
                isOpen={isInfoModalOpen}
                onClose={handleCloseModals}
                member={selectedMember}
                activities={activities}
                categories={categories}
            />
        </div>
    );
};

export default Socios;
