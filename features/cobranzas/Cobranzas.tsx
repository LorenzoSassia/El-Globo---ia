import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Cobrador, ReporteCobranza, Zona, Socio, Categoria, EstadoSocio } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminCobranzas: React.FC = () => {
    const [cobradores, setCobradores] = useState<Cobrador[]>([]);
    const [zonas, setZonas] = useState<Zona[]>([]);
    const [idCobradorSeleccionado, setIdCobradorSeleccionado] = useState<number | ''>('');
    const [reporte, setReporte] = useState<ReporteCobranza | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Promise.all([api.getCobradores(), api.getZonas()]).then(([cobradoresData, zonasData]) => {
            setCobradores(cobradoresData as Cobrador[]);
            setZonas(zonasData as Zona[]);
        });
    }, []);

    const handleGenerarReporte = async () => {
        if (!idCobradorSeleccionado) return;
        setLoading(true);
        setReporte(null);
        try {
            // Lógica de reporte del lado del cliente (como en la mockApi original)
            const cobrador = cobradores.find(c => c.id === idCobradorSeleccionado);
            if (!cobrador) throw new Error("Cobrador no encontrado");

            const [socios, categorias] = await Promise.all([api.getSocios(), api.getCategorias()]);
            const sociosAsignados = (socios as Socio[]).filter(s => s.zonas_id === cobrador.zonas_id);

            const montoACobrar = sociosAsignados
                .filter(s => s.status === EstadoSocio.DEBE)
                .reduce((sum, socio) => {
                    const categoria = (categorias as Categoria[]).find(c => c.id === socio.categorias_id);
                    return sum + (categoria?.monto || 0);
                }, 0);
                
            const comision = montoACobrar * 0.10;
            const netoARendir = montoACobrar - comision;
            
            setReporte({ cobradorId: idCobradorSeleccionado, montoACobrar, comision, netoARendir });

        } catch (error) {
            console.error(error);
            alert('Error al generar el reporte.');
        } finally {
            setLoading(false);
        }
    };
    
    const getNombreZona = (id: number) => zonas.find(z => z.id === id)?.zona || 'N/A';

    return (
        <>
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Generar Reporte de Cobranza (Admin)</h2>
                <div className="flex items-end mt-4 space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="collector" className="block mb-2 text-sm font-medium text-gray-300">Seleccionar Cobrador</label>
                        <select
                            id="collector"
                            value={idCobradorSeleccionado}
                            onChange={(e) => setIdCobradorSeleccionado(Number(e.target.value))}
                            className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un cobrador</option>
                            {cobradores.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre} (Zona: {getNombreZona(c.zonas_id)})</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerarReporte}
                        disabled={!idCobradorSeleccionado || loading}
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Generando...' : 'Generar'}
                    </button>
                </div>
            </div>

            {reporte && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold text-white">Reporte para {cobradores.find(c => c.id === reporte.cobradorId)?.nombre}</h2>
                    <div className="mt-4 space-y-2">
                        <p className="text-gray-300">Monto Total a Cobrar: <span className="font-semibold text-white">${reporte.montoACobrar.toLocaleString()}</span></p>
                        <p className="text-gray-300">Comisión (10%): <span className="font-semibold text-white">${reporte.comision.toLocaleString()}</span></p>
                        <p className="text-lg text-green-400">Neto a Rendir: <span className="font-bold">${reporte.netoARendir.toLocaleString()}</span></p>
                    </div>
                </div>
            )}
        </>
    );
};

const CobradorCobranzas: React.FC = () => {
    const { usuario } = useAuth();
    const [sociosAsignados, setSociosAsignados] = useState<Socio[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [zona, setZona] = useState<Zona | null>(null);
    const [loading, setLoading] = useState(true);

    const cargarDatos = async () => {
        if (!usuario || !usuario.zonaId) return;
        setLoading(true);
        try {
            const [todosLosSocios, catData, zonasData] = await Promise.all([
                api.getSocios(),
                api.getCategorias(),
                api.getZonas()
            ]);
            setSociosAsignados((todosLosSocios as Socio[]).filter(s => s.zonas_id === usuario.zonaId && s.status !== EstadoSocio.INACTIVO));
            setCategorias(catData as Categoria[]);
            setZona((zonasData as Zona[]).find(z => z.id === usuario.zonaId) || null);
        } catch (error) {
            console.error("Error al cargar datos del cobrador:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, [usuario]);

    const handleRegistrarPago = async (socio: Socio) => {
        if (!usuario?.cobradorId) return;
        const categoria = categorias.find(c => c.id === socio.categorias_id);
        if (!categoria) return;

        if (window.confirm(`¿Confirmar pago de $${categoria.monto} para ${socio.nombre} ${socio.apellido}?`)) {
            try {
                await api.addCobranza({
                    socios_id: socio.id,
                    cobradores_id: usuario.cobradorId,
                    monto: categoria.monto,
                    fecha_emision: new Date().toISOString().split('T')[0],
                    mes: new Date().toLocaleString('es-ES', { month: 'long' }),
                    estado: 'Pago',
                    recargo: 0,
                    descuento: 0,
                });
                // Adicionalmente, se debería actualizar el estado del socio
                await api.updateSocio(socio.id, { ...socio, status: EstadoSocio.PAGO });
                alert('Pago registrado exitosamente.');
                cargarDatos(); // Recargar datos
            } catch(error) {
                console.error("Error al registrar el pago:", error);
                alert("Error al registrar el pago.");
            }
        }
    };
    
    const getCuotaSocio = (socio: Socio) => categorias.find(c => c.id === socio.categorias_id)?.monto || 0;

    if (loading) return <p className="text-center text-gray-400">Cargando socios asignados...</p>;

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold text-white">Socios Asignados a mi Zona ({zona?.zona || ''})</h2>
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
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${socio.status === EstadoSocio.PAGO ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'}`}>
                                        {socio.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">${getCuotaSocio(socio).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {socio.status === EstadoSocio.DEBE ? (
                                        <button 
                                            onClick={() => handleRegistrarPago(socio)}
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
            {usuario?.rol === 'admin' ? <AdminCobranzas /> : <CobradorCobranzas />}
        </div>
    );
};

export default Cobranzas;
