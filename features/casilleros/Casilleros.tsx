import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Member } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';

const Casilleros: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    
    // Modal form state
    const [modalSelectedMemberId, setModalSelectedMemberId] = useState<string>('');
    const [modalLockerNumber, setModalLockerNumber] = useState<string>('');

    const loadMembers = async () => {
        const membersData = await mockApi.getMembers();
        setMembers(membersData);
    };

    useEffect(() => {
        loadMembers();
    }, []);

    const membersWithLocker = members.filter(m => m.hasLocker && m.lockerNumber).sort((a,b) => (a.lockerNumber || 0) - (b.lockerNumber || 0));
    const membersWithoutLocker = members.filter(m => !m.hasLocker);

    const handleOpenModal = (member: Member | null = null) => {
        setEditingMember(member);
        if (member) {
            setModalLockerNumber(member.lockerNumber?.toString() || '');
            setModalSelectedMemberId(member.id.toString());
        } else {
            setModalLockerNumber('');
            setModalSelectedMemberId('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleSave = async () => {
        if (!modalSelectedMemberId || !modalLockerNumber) {
            alert('Por favor, complete todos los campos.');
            return;
        }
        const memberId = parseInt(modalSelectedMemberId, 10);
        const lockerNumber = parseInt(modalLockerNumber, 10);
        
        const member = members.find(m => m.id === memberId);
        if (member) {
            const updatedMember: Member = { ...member, hasLocker: true, lockerNumber };
            await mockApi.updateMember(updatedMember);
            loadMembers();
            handleCloseModal();
        }
    };
    
    const handleFreeLocker = async (memberId: number) => {
        if (window.confirm('¿Está seguro de que desea liberar este casillero?')) {
            const member = members.find(m => m.id === memberId);
            if (member) {
                const updatedMember: Member = { ...member, hasLocker: false, lockerNumber: undefined };
                await mockApi.updateMember(updatedMember);
                loadMembers();
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Casilleros</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <PlusIcon />
                    <span className="ml-2">Asignar Casillero</span>
                </button>
            </div>

            <div className="overflow-x-auto bg-gray-800 rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">N° Casillero</th>
                            <th scope="col" className="px-6 py-3">Socio</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membersWithLocker.map((member) => (
                            <tr key={member.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{member.lockerNumber}</td>
                                <td className="px-6 py-4">{`${member.firstName} ${member.lastName}`}</td>
                                <td className="flex items-center px-6 py-4 space-x-3">
                                    <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:text-blue-400"><PencilIcon /></button>
                                    <button onClick={() => handleFreeLocker(member.id)} className="text-red-500 hover:text-red-400"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-bold text-white">{editingMember ? 'Editar Asignación' : 'Asignar Casillero'}</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="socio" className="block mb-2 text-sm font-medium text-gray-300">Socio</label>
                                {editingMember ? (
                                    <input type="text" value={`${editingMember.firstName} ${editingMember.lastName}`} className="w-full px-3 py-2 text-gray-400 bg-gray-700 border border-gray-600 rounded-md" disabled />
                                ) : (
                                    <select id="socio" value={modalSelectedMemberId} onChange={(e) => setModalSelectedMemberId(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Seleccione un socio</option>
                                        {membersWithoutLocker.map(m => (
                                            <option key={m.id} value={m.id}>{`${m.firstName} ${m.lastName}`}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lockerNumber" className="block mb-2 text-sm font-medium text-gray-300">Número de Casillero</label>
                                <input type="number" id="lockerNumber" value={modalLockerNumber} onChange={(e) => setModalLockerNumber(e.target.value)} className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 101" />
                            </div>
                        </div>
                        <div className="flex justify-end pt-6 space-x-2">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
                            <button type="button" onClick={handleSave} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Casilleros;