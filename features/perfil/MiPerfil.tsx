import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../services/mockApi';
import { Member, Activity, MemberCategoryInfo } from '../../types';

const MiPerfil: React.FC = () => {
    const { user } = useAuth();
    const [memberData, setMemberData] = useState<Member | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            if (user?.memberId) {
                try {
                    const [member, allActivities, allCategories] = await Promise.all([
                        mockApi.getMember(user.memberId),
                        mockApi.getActivities(),
                        mockApi.getMemberCategories()
                    ]);
                    setMemberData(member || null);
                    setActivities(allActivities);
                    setCategories(allCategories);
                } catch (error) {
                    console.error("Failed to load profile data", error);
                }
            }
            setLoading(false);
        };
        loadProfile();
    }, [user]);

    if (loading) {
        return <p className="text-center text-gray-400">Cargando perfil...</p>;
    }

    if (!memberData) {
        return <p className="text-center text-red-500">No se pudo encontrar la información del socio.</p>;
    }
    
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'Desconocida';
    const memberActivities = activities.filter(a => memberData.activities.includes(a.id));

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Mi Perfil de Socio</h1>
            <div className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{memberData.firstName} {memberData.lastName}</h2>
                        <p className="text-gray-400">Socio N°: {memberData.id}</p>
                    </div>
                     <div className="md:text-right">
                        <p className="text-lg">Estado: <span className={`font-semibold ${memberData.status === 'activo' ? 'text-green-400' : 'text-yellow-400'}`}>{memberData.status.toUpperCase()}</span></p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Fecha de Nacimiento:</p>
                        <p>{memberData.birthDate}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Fecha de Ingreso:</p>
                        <p>{memberData.joinDate}</p>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-300">Categoría:</p>
                        <p>{getCategoryName(memberData.categoryId)}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-300">Locker:</p>
                        <p>{memberData.hasLocker ? 'Sí' : 'No'}</p>
                    </div>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-700">
                    <h3 className="text-xl font-semibold text-white">Actividades Inscritas</h3>
                    {memberActivities.length > 0 ? (
                        <ul className="mt-4 space-y-2 list-disc list-inside">
                            {memberActivities.map(activity => (
                                <li key={activity.id} className="text-gray-300">{activity.name} - ${activity.cost}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-4 text-gray-400">No estás inscripto en ninguna actividad.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiPerfil;
