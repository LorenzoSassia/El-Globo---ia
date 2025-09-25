import React, { useState, useEffect } from 'react';
import { Activity } from '../../types';
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

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    const data = await mockApi.getActivities();
    setActivities(data);
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
              {isAdmin && <th scope="col" className="px-6 py-3">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                <td className="px-6 py-4">{activity.id}</td>
                <td className="px-6 py-4 text-white">{activity.name}</td>
                <td className="px-6 py-4">${activity.cost.toLocaleString()}</td>
                <td className="px-6 py-4 capitalize">{activity.schedule}</td>
                {isAdmin && (
                    <td className="flex items-center px-6 py-4 space-x-3">
                    <button onClick={() => handleOpenModal(activity)} className="text-blue-500 hover:text-blue-400"><PencilIcon/></button>
                    <button onClick={() => handleDeleteActivity(activity.id)} className="text-red-500 hover:text-red-400"><TrashIcon/></button>
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
