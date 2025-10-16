import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Socio, Actividad, Categoria } from '../../types';
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
    const [socios, setSocios] = useState<Socio[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sociosData, actividadesData, categoriasData] = await Promise.all([
                    api.getSocios(),
                    api.getActividades(),
                    api.getCategorias()
                ]);
                setSocios(sociosData as Socio[]);
                setActividades(actividadesData as Actividad[]);
                setCategorias(categoriasData as Categoria[]);
            } catch (error) {
                console.error("Error al cargar el dashboard:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalIngresos = socios.reduce((sum, socio) => {
        const infoCategoria = categorias.find(c => c.id === socio.categorias_id);
        return sum + (infoCategoria?.monto || 0);
    }, 0);

    if (loading) {
        return <p className="text-center text-gray-400">Cargando dashboard...</p>;
    }

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Total Socios" value={socios.length} icon={<UsersIcon />} />
                <StatCard title="Actividades Disponibles" value={actividades.length} icon={<SparklesIcon />} />
                <StatCard title="Ingresos Mensuales (Cuotas)" value={`$${totalIngresos.toLocaleString()}`} icon={<CurrencyDollarIcon />} />
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