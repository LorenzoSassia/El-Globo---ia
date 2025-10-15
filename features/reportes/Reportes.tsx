import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Socio, Cobranza, EstadoSocio } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface ReporteSemanalData {
    pagosUltimaSemana: (Cobranza & { nombreSocio: string })[];
    morosos: Socio[];
}

const Reportes: React.FC = () => {
    const { usuario } = useAuth();
    const [reporte, setReporte] = useState<ReporteSemanalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generarReporteSemanal = async () => {
            if (!usuario?.cobradorId || usuario.zonaId === undefined) return;
            setLoading(true);

            try {
                const [cobranzas, socios] = await Promise.all([api.getCobranzas(), api.getSocios()]);
                
                const sieteDiasAtras = new Date();
                sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

                const pagosUltimaSemana = (cobranzas as Cobranza[])
                    .filter(c => c.cobradores_id === usuario.cobradorId && new Date(c.fecha_emision) >= sieteDiasAtras)
                    .map(c => {
                        const socio = (socios as Socio[]).find(s => s.id === c.socios_id);
                        return { ...c, nombreSocio: socio ? `${socio.nombre} ${socio.apellido}` : 'Socio no encontrado' };
                    })
                    .sort((a, b) => new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime());

                const morosos = (socios as Socio[]).filter(s => s.zonas_id === usuario.zonaId && s.status === EstadoSocio.DEBE);

                setReporte({ pagosUltimaSemana, morosos });
            } catch (error) {
                console.error("Error al generar reporte:", error);
                alert("No se pudo generar el reporte.");
            } finally {
                setLoading(false);
            }
        };
        generarReporteSemanal();
    }, [usuario]);
    
    if (loading) return <p className="text-center text-gray-400">Generando reporte semanal...</p>;
    if (!reporte) return <p className="text-center text-red-500">No se pudo generar el reporte.</p>;

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
                                {reporte.pagosUltimaSemana.length > 0 ? reporte.pagosUltimaSemana.map(p => (
                                    <tr key={p.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{p.fecha_emision}</td>
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
                                {reporte.morosos.length > 0 ? reporte.morosos.map(s => (
                                    <tr key={s.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{s.id}</td>
                                        <td className="px-6 py-4 text-white">{`${s.nombre} ${s.apellido}`}</td>
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
