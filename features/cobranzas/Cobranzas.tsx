
import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { Cobrador, ReporteCobranza, ZonaCobranza, Socio, InfoCategoriaSocio, EstadoSocio } from '../../types';
import { useAuth } from '../../context/AuthContext';

const CobranzasAdmin: React.FC = () => {
    const [cobradores, setCobradores] = useState<Cobrador[]>([]);
    const [cobradorSeleccionadoId, setCobradorSeleccionadoId] = useState<number | ''>('');
    const [reporte, setReporte] = useState<ReporteCobranza | null>(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        mockApi.getCobradores().then(setCobradores);
    }, []);

    const generarReporte = async () => {
        if (!cobradorSeleccionadoId) return;
        setCargando(true);
        setReporte(null);
        try {
            const datosReporte = await mockApi.getReporteCobranza(cobradorSeleccionadoId);
            setReporte(datosReporte);
        } catch (error) {
            console.error(error);
            alert('Error al generar el reporte.');
        } finally {
            setCargando(false);
        }
    };
    
    const obtenerNombreZona = (zona: ZonaCobranza) => ZonaCobranza[zona];

    return (
        <>
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Generar Reporte de Cobranza (Admin)</h2>
                <div className="flex items-end mt-4 space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="collector" className="block mb-2 text-sm font-medium text-gray-300">Seleccionar Cobrador</label>
                        <select
                            id="collector"
                            value={cobradorSeleccionadoId}
                            onChange={(e) => setCobradorSeleccionadoId(Number(e.target.value))}
                            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un cobrador</option>
                            {cobradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre} (Zona: {obtenerNombreZona(c.zona)})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={generarReporte}
                        disabled={!cobradorSeleccionadoId || cargando}
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {cargando ? 'Generando...' : 'Generar'}
                    </button>
                </div>
            </div>

            {reporte && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold text-white">Reporte para {cobradores.find(c => c.id === reporte.cobradorId)?.nombre}</h2>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-300">Monto Total a Cobrar: <span className="font-semibold text-white">${reporte.monto.toLocaleString()}</span></p>
                        <p className="text-gray-300">Comisión (10%): <span className="font-semibold text-white">${reporte.comision.toLocaleString()}</span></p>
                        <p className="text-lg text-green-400">Neto a Rendir: <span className="font-bold">${reporte.neto.toLocaleString()}</span></p>
                    </div>
                </div>
            )}
        </>
    );
};

const CobranzasCobrador: React.FC = () => {
    const { usuario } = useAuth();
    const [sociosAsignados, setSociosAsignados] = useState<Socio[]>([]);
    const [categorias, setCategorias] = useState<InfoCategoriaSocio[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargarDatos = async () => {
        if (!usuario || typeof usuario.zona === 'undefined') return;
        setCargando(true);
        const [todosLosSocios, datosCategorias] = await Promise.all([
            mockApi.getSocios(),
            mockApi.getCategoriasSocios()
        ]);
        setSociosAsignados(todosLosSocios.filter(m => m.zona === usuario.zona && m.estado !== EstadoSocio.INACTIVO));
        setCategorias(datosCategorias);
        setCargando(false);
    };

    useEffect(() => {
        cargarDatos();
    }, [usuario]);

    const registrarPago = async (socio: Socio) => {
        if (!usuario?.cobradorId) return;
        const categoria = categorias.find(c => c.id === socio.categoriaId);
        if (!categoria) return;

        if (window.confirm(`¿Confirmar pago de $${categoria.cuota} para ${socio.nombre} ${socio.apellido}?`)) {
            await mockApi.registrarPago({
                socioId: socio.id,
                cobradorId: usuario.cobradorId,
                monto: categoria.cuota,
                fecha: new Date().toISOString().split('T')[0]
            });
            alert('Pago registrado exitosamente.');
            cargarDatos(); // Recargar datos
        }
    };
    
    const obtenerCuotaSocio = (socio: Socio) => categorias.find(c => c.id === socio.categoriaId)?.cuota || 0;

    if (cargando) return <p className="text-center text-gray-400">Cargando socios asignados...</p>;

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-white">Socios Asignados a mi Zona ({usuario?.zona !== undefined ? ZonaCobranza[usuario.zona] : ''})</h2>
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
                        {sociosAsignados.map((socio) => (
                            <tr key={socio.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-white">{`${socio.nombre} ${socio.apellido}`}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${socio.estado === EstadoSocio.ACTIVO ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'}`}>
                                        {socio.estado}
                                    </span>
                                </td>
                                <td className="px-6 py-4">${obtenerCuotaSocio(socio).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {socio.estado === EstadoSocio.MOROSO ? (
                                        <button 
                                            onClick={() => registrarPago(socio)}
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
    const { usuario } = useAuth();
    
    return (
        <div>
            <h1 className="mb-8 text-3xl font-bold text-white">Gestión de Cobranzas</h1>
            {usuario?.rol === 'admin' ? <CobranzasAdmin /> : <CobranzasCobrador />}
        </div>
    );
};

export default Cobranzas;
