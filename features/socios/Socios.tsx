import React, { useState, useEffect } from 'react';
import { Member, MemberStatus } from '../../types';
import { mockApi } from '../../services/mockApi';
import SocioModal from './SocioModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Socios: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await mockApi.getMembers();
    setMembers(data);
  };

  const handleOpenModal = (member: Member | null = null) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleSaveMember = async (member: Member) => {
    if (selectedMember) {
      await mockApi.updateMember({ ...member, id: selectedMember.id });
    } else {
      await mockApi.addMember(member);
    }
    loadMembers();
    handleCloseModal();
  };

  const handleDeleteMember = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar a este socio?')) {
        await mockApi.deleteMember(id);
        loadMembers();
    }
  };

  const statusColor = (status: MemberStatus) => {
      switch(status) {
          case MemberStatus.ACTIVE: return 'bg-green-500';
          case MemberStatus.DELINQUENT: return 'bg-yellow-500';
          case MemberStatus.INACTIVE: return 'bg-red-500';
      }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Gestión de Socios</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
            <PlusIcon />
            <span className="ml-2">Nuevo Socio</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nombre Completo</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{member.id}</td>
                <td className="px-6 py-4 text-white">{`${member.firstName} ${member.lastName}`}</td>
                <td className="px-6 py-4">{member.categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${statusColor(member.status)}`}>
                    {member.status}
                  </span>
                </td>
                <td className="flex items-center px-6 py-4 space-x-3">
                  <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-400"><PencilIcon/></button>
                  <button onClick={() => handleDeleteMember(member.id)} className="text-red-500 hover:text-red-400"><TrashIcon/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <SocioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMember}
        member={selectedMember}
      />
    </div>
  );
};

export default Socios;
