
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Socio, EstadoSocio, Pago } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DatosReporteSemanal {
    pagadoUltimaSemana: (Pago & { nombreSocio: string })[];
    morosos: Socio[];
}

const Reportes: React.FC = () => {
    const { usuario } = useAuth();
    const [reporte, setReporte] = useState<DatosReporteSemanal | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const generarReporteSemanal = async () => {
            if (!usuario?.cobradorId || usuario.zona === undefined) return;
            setCargando(true);

            const [pagos, socios] = await Promise.all([mockApi.getPagos(), mockApi.getSocios()]);
            
            const haceSieteDias = new Date();
            haceSieteDias.setDate(haceSieteDias.getDate() - 7);

            const pagadoUltimaSemana = pagos
                .filter(p => p.cobradorId === usuario.cobradorId && new Date(p.fecha) >= haceSieteDias)
                .map(p => {
                    const socio = socios.find(m => m.id === p.socioId);
                    return { ...p, nombreSocio: socio ? `${socio.nombre} ${socio.apellido}` : 'Socio no encontrado' };
                })
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

            const morosos = socios.filter(m => m.zona === usuario.zona && m.estado === EstadoSocio.MOROSO);

            setReporte({ pagadoUltimaSemana, morosos });
            setCargando(false);
        };
        generarReporteSemanal();
    }, [usuario]);
    
    if (cargando) return <p>Generando reporte semanal...</p>;
    if (!reporte) return <p>No se pudo generar el reporte.</p>;

    return (
         <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Reporte Semanal de Cobranza</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="mb-4 text-2xl font-semibold text-white">Pagos Recibidos (Últimos 7 días)</h2>
                    <div className="overflow-x-auto bg-gray-800 rounded-lg">
                        <table className="min-w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Socio</th>
                                    <th className="px-6 py-3">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.pagadoUltimaSemana.length > 0 ? reporte.pagadoUltimaSemana.map(p => (
                                    <tr key={p.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{p.fecha}</td>
                                        <td className="px-6 py-4 text-white">{p.nombreSocio}</td>
                                        <td className="px-6 py-4">${p.monto.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center">No hay pagos registrados esta semana.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 text-2xl font-semibold text-white">Socios Morosos Pendientes en mi Zona</h2>
                    <div className="overflow-x-auto bg-gray-800 rounded-lg">
                        <table className="min-w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Nombre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporte.morosos.length > 0 ? reporte.morosos.map(m => (
                                    <tr key={m.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{m.id}</td>
                                        <td className="px-6 py-4 text-white">{`${m.nombre} ${m.apellido}`}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={2} className="px-6 py-4 text-center">No hay socios morosos en la zona.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reportes;
