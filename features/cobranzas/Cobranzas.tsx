import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Collector, CollectionReport, CollectionZone, Member, MemberCategoryInfo, MemberStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminCobranzas: React.FC = () => {
    const [collectors, setCollectors] = useState<Collector[]>([]);
    const [selectedCollectorId, setSelectedCollectorId] = useState<number | ''>('');
    const [report, setReport] = useState<CollectionReport | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        mockApi.getCollectors().then(setCollectors);
    }, []);

    const handleGenerateReport = async () => {
        if (!selectedCollectorId) return;
        setLoading(true);
        setReport(null);
        try {
            const reportData = await mockApi.getCollectionReport(selectedCollectorId);
            setReport(reportData);
        } catch (error) {
            console.error(error);
            alert('Error al generar el reporte.');
        } finally {
            setLoading(false);
        }
    };
    
    const getZoneName = (zone: CollectionZone) => CollectionZone[zone];

    return (
        <>
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Generar Reporte de Cobranza (Admin)</h2>
                <div className="flex items-end mt-4 space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="collector" className="block mb-2 text-sm font-medium text-gray-300">Seleccionar Cobrador</label>
                        <select
                            id="collector"
                            value={selectedCollectorId}
                            onChange={(e) => setSelectedCollectorId(Number(e.target.value))}
                            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un cobrador</option>
                            {collectors.map(c => (
                                <option key={c.id} value={c.id}>{c.name} (Zona: {getZoneName(c.zone)})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerateReport}
                        disabled={!selectedCollectorId || loading}
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generando...' : 'Generar'}
                    </button>
                </div>
            </div>

            {report && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold text-white">Reporte para {collectors.find(c => c.id === report.collectorId)?.name}</h2>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-300">Monto Total a Cobrar: <span className="font-semibold text-white">${report.amount.toLocaleString()}</span></p>
                        <p className="text-gray-300">Comisión (10%): <span className="font-semibold text-white">${report.commission.toLocaleString()}</span></p>
                        <p className="text-lg text-green-400">Neto a Rendir: <span className="font-bold">${report.net.toLocaleString()}</span></p>
                    </div>
                </div>
            )}
        </>
    );
};

const CobradorCobranzas: React.FC = () => {
    const { user } = useAuth();
    const [assignedMembers, setAssignedMembers] = useState<Member[]>([]);
    const [categories, setCategories] = useState<MemberCategoryInfo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        if (!user || typeof user.zone === 'undefined') return;
        setLoading(true);
        const [allMembers, catData] = await Promise.all([
            mockApi.getMembers(),
            mockApi.getMemberCategories()
        ]);
        setAssignedMembers(allMembers.filter(m => m.zone === user.zone && m.status !== MemberStatus.INACTIVE));
        setCategories(catData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleRecordPayment = async (member: Member) => {
        if (!user?.collectorId) return;
        const category = categories.find(c => c.id === member.categoryId);
        if (!category) return;

        if (window.confirm(`¿Confirmar pago de $${category.fee} para ${member.firstName} ${member.lastName}?`)) {
            await mockApi.recordPayment({
                memberId: member.id,
                collectorId: user.collectorId,
                amount: category.fee,
                date: new Date().toISOString().split('T')[0]
            });
            alert('Pago registrado exitosamente.');
            loadData(); // Refresh data
        }
    };
    
    const getMemberFee = (member: Member) => categories.find(c => c.id === member.categoryId)?.fee || 0;

    if (loading) return <p className="text-center text-gray-400">Cargando socios asignados...</p>;

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-white">Socios Asignados a mi Zona ({user?.zone !== undefined ? CollectionZone[user.zone] : ''})</h2>
            <div className="mt-4 overflow-x-auto">
                 <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Cuota</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedMembers.map((member) => (
                            <tr key={member.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{`${member.firstName} ${member.lastName}`}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${member.status === MemberStatus.ACTIVE ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'}`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">${getMemberFee(member).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {member.status === MemberStatus.DELINQUENT ? (
                                        <button 
                                            onClick={() => handleRecordPayment(member)}
                                            className="px-3 py-1 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                            Registrar Pago
                                        </button>
                                    ) : (
                                        <span className="italic text-gray-500">Al día</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Cobranzas: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Gestión de Cobranzas</h1>
            {user?.role === 'admin' ? <AdminCobranzas /> : <CobradorCobranzas />}
        </div>
    );
};

export default Cobranzas;