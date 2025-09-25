import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Collector, CollectionReport, CollectionZone } from '../../types';

const Cobranzas: React.FC = () => {
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
    
    const getZoneName = (zone: CollectionZone) => {
        return CollectionZone[zone];
    }

    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Gestión de Cobranzas</h1>
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Generar Reporte de Cobranza</h2>
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
        </div>
    );
};

export default Cobranzas;
