import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { Member, Activity, MemberCategoryInfo } from '../../types';
import { UsersIcon, SparklesIcon, CurrencyDollarIcon } from '../../components/icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="p-6 bg-gray-800 rounded-lg">
        <div className="flex items-center">
            <div className="p-3 text-white bg-gray-700 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-2xl font-semibold text-white">{value}</p>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [membersData, activitiesData, categoriesData] = await Promise.all([
                mockApi.getMembers(),
                mockApi.getActivities(),
                mockApi.getMemberCategories()
            ]);
            setMembers(membersData);
            setActivities(activitiesData);
            setCategories(categoriesData);
        };
        fetchData();
    }, []);

    const totalFees = members.reduce((sum, member) => {
        const categoryInfo = categories.find(c => c.id === member.categoryId);
        return sum + (categoryInfo?.fee || 0);
    }, 0);

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Socios" value={members.length} icon={<UsersIcon />} />
                <StatCard title="Actividades Disponibles" value={activities.length} icon={<SparklesIcon />} />
                <StatCard title="Ingresos Mensuales (Cuotas)" value={`$${totalFees.toLocaleString()}`} icon={<CurrencyDollarIcon />} />
            </div>
            <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Bienvenido al Sistema de Gestión del Club</h2>
                <p className="mt-2 text-gray-400">
                    Utilice la barra lateral para navegar por las diferentes secciones del sistema.
                    Puede gestionar socios, actividades, cobranzas y generar reportes.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
