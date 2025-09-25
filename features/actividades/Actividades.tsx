import React, { useState, useEffect } from 'react';
import { Activity, Member } from '../../types';
import { mockApi } from '../../services/mockApi';
import ActividadModal from './ActividadModal';
import { PlusIcon, PencilIcon, TrashIcon } from '../../components/icons';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Actividades: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);

  useEffect(() => {
    loadActivities();
    loadMemberData();
  }, [user]);

  const loadActivities = async () => {
    const data = await mockApi.getActivities();
    setActivities(data);
  };

  const loadMemberData = async () => {
      if (user?.role === UserRole.SOCIO && user.memberId) {
          const memberData = await mockApi.getMember(user.memberId);
          setCurrentMember(memberData || null);
      }
  };
  
  const handleEnrollmentToggle = async (activityId: number) => {
      if (!currentMember) return;
      
      const isEnrolled = currentMember.activities.includes(activityId);
      const updatedActivities = isEnrolled
          ? currentMember.activities.filter(id => id !== activityId)
          : [...currentMember.activities, activityId];
          
      const updatedMember = { ...currentMember, activities: updatedActivities };
      
      await mockApi.updateMember(updatedMember);
      setCurrentMember(updatedMember);
  };

  const handleOpenModal = (activity: Activity | null = null) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSaveActivity = async (activity: Activity) => {
    if (selectedActivity) {
      await mockApi.updateActivity({ ...activity, id: selectedActivity.id });
    } else {
      await mockApi.addActivity(activity);
    }
    loadActivities();
    handleCloseModal();
  };

  const handleDeleteActivity = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta actividad?')) {
      await mockApi.deleteActivity(id);
      loadActivities();
    }
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isSocio = user?.role === UserRole.SOCIO;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Actividades del Club</h1>
        {isAdmin && (
            <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                <PlusIcon />
                <span className="ml-2">Nueva Actividad</span>
            </button>
        )}
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Costo</th>
              <th scope="col" className="px-6 py-3">Horario</th>
              {(isAdmin || isSocio) && <th scope="col" className="px-6 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{activity.id}</td>
                <td className="px-6 py-4 text-white">{activity.name}</td>
                <td className="px-6 py-4">${activity.cost.toLocaleString()}</td>
                <td className="px-6 py-4 capitalize">{activity.schedule}</td>
                {(isAdmin || isSocio) && (
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            {isAdmin && (
                                <>
                                <button onClick={() => handleOpenModal(activity)} className="text-blue-500 hover:text-blue-400"><PencilIcon/></button>
                                <button onClick={() => handleDeleteActivity(activity.id)} className="text-red-500 hover:text-red-400"><TrashIcon/></button>
                                </>
                            )}
                            {isSocio && currentMember && (
                                <button 
                                    onClick={() => handleEnrollmentToggle(activity.id)}
                                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        currentMember.activities.includes(activity.id)
                                            ? 'bg-red-600 hover:bg-red-700 text-white'
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {currentMember.activities.includes(activity.id) ? 'Darse de baja' : 'Inscribirse'}
                                </button>
                            )}
                        </div>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isAdmin && <ActividadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveActivity}
        activity={selectedActivity}
      />}
    </div>
  );
};

export default Actividades;
