
import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { Socio, Actividad, InfoCategoriaSocio } from '../../types';
import { UsersIcon, SparklesIcon, CurrencyDollarIcon } from '../../components/icons';

const TarjetaEstadistica: React.FC<{ titulo: string; valor: string | number; icono: React.ReactNode }> = ({ titulo, valor, icono }) => (
    <div className="p-6 bg-gray-800 rounded-lg">
        <div className="flex items-center">
            <div className="p-3 text-white bg-gray-700 rounded-full">
                {icono}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{titulo}</p>
                <p className="text-2xl font-semibold text-white">{valor}</p>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const [socios, setSocios] = useState<Socio[]>([]);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [categorias, setCategorias] = useState<InfoCategoriaSocio[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            const [datosSocios, datosActividades, datosCategorias] = await Promise.all([
                mockApi.getSocios(),
                mockApi.getActividades(),
                mockApi.getCategoriasSocios()
            ]);
            setSocios(datosSocios);
            setActividades(datosActividades);
            setCategorias(datosCategorias);
        };
        cargarDatos();
    }, []);

    const cuotasTotales = socios.reduce((sum, socio) => {
        const infoCategoria = categorias.find(c => c.id === socio.categoriaId);
        return sum + (infoCategoria?.cuota || 0);
    }, 0);

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <TarjetaEstadistica titulo="Total Socios" valor={socios.length} icono={<UsersIcon />} />
                <TarjetaEstadistica titulo="Actividades Disponibles" valor={actividades.length} icono={<SparklesIcon />} />
                <TarjetaEstadistica titulo="Ingresos Mensuales (Cuotas)" valor={`$${cuotasTotales.toLocaleString()}`} icono={<CurrencyDollarIcon />} />
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
