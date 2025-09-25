import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Member, MemberStatus, Payment } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface WeeklyReportData {
    paidLastWeek: (Payment & { memberName: string })[];
    delinquent: Member[];
}

const Reportes: React.FC = () => {
    const { user } = useAuth();
    const [report, setReport] = useState<WeeklyReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateWeeklyReport = async () => {
            if (!user?.collectorId || user.zone === undefined) return;
            setLoading(true);

            const [payments, members] = await Promise.all([mockApi.getPayments(), mockApi.getMembers()]);
            
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const paidLastWeek = payments
                .filter(p => p.collectorId === user.collectorId && new Date(p.date) >= sevenDaysAgo)
                .map(p => {
                    const member = members.find(m => m.id === p.memberId);
                    return { ...p, memberName: member ? `${member.firstName} ${member.lastName}` : 'Socio no encontrado' };
                })
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const delinquent = members.filter(m => m.zone === user.zone && m.status === MemberStatus.DELINQUENT);

            setReport({ paidLastWeek, delinquent });
            setLoading(false);
        };
        generateWeeklyReport();
    }, [user]);
    
    if (loading) return <p>Generando reporte semanal...</p>;
    if (!report) return <p>No se pudo generar el reporte.</p>;

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
                                {report.paidLastWeek.length > 0 ? report.paidLastWeek.map(p => (
                                    <tr key={p.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{p.date}</td>
                                        <td className="px-6 py-4 text-white">{p.memberName}</td>
                                        <td className="px-6 py-4">${p.amount.toLocaleString()}</td>
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
                                {report.delinquent.length > 0 ? report.delinquent.map(m => (
                                    <tr key={m.id} className="border-b bg-gray-800 border-gray-700">
                                        <td className="px-6 py-4">{m.id}</td>
                                        <td className="px-6 py-4 text-white">{`${m.firstName} ${m.lastName}`}</td>
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