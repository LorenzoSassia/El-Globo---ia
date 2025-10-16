import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Cobrador, ReporteCobranza, Zona, Socio, Categoria, EstadoSocio, Cobranza } from '../../types';
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
            // La lógica de cálculo ahora está delegada al backend para mayor eficiencia.
            const reporteData = await api.getReporteCobranza(idCobradorSeleccionado);
            setReporte(reporteData as ReporteCobranza);
        } catch (error) {
            console.error(error);
            alert('Error al generar el reporte. Asegúrese de que el endpoint /api/cobranzas/reporte/:id exista en el backend.');
        } finally {
            setLoading(false);
        }
    };
    
    const getNombreZona = (id: number) => zonas.find(z => z.id === id)?.zona || 'N/A';

    return (
        <>
            <div className="p-6 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-semibold text-white">Generar Reporte de Cobranza</h2>
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
    const [sociosPorCobrar, setSociosPorCobrar] = useState<Socio[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagando, setPagando] = useState<number | null>(null);

    const cargarDatosCobrador = async () => {
        if (!usuario || usuario.rol !== 'cobrador' || !usuario.zonaId) return;
        setLoading(true);
        try {
            const [todosLosSocios, todasLasCategorias] = await Promise.all([
                api.getSocios(),
                api.getCategorias()
            ]);
            
            const sociosFiltrados = (todosLosSocios as Socio[]).filter(s => 
                s.zonas_id === usuario.zonaId && s.status === EstadoSocio.DEBE
            );

            setSociosPorCobrar(sociosFiltrados);
            setCategorias(todasLasCategorias as Categoria[]);
        } catch (error) {
            console.error("Error al cargar datos para cobranza:", error);
            alert("No se pudieron cargar los datos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosCobrador();
    }, [usuario]);

    const handleRegistrarPago = async (socio: Socio) => {
        if (!usuario?.cobradorId) return;

        const categoriaSocio = categorias.find(c => c.id === socio.categorias_id);
        if (!categoriaSocio) {
            alert("No se pudo encontrar la categoría del socio.");
            return;
        }

        const confirmacion = window.confirm(`¿Confirmar el pago de $${categoriaSocio.monto.toLocaleString()} para ${socio.nombre} ${socio.apellido}?`);
        if (!confirmacion) return;

        setPagando(socio.id);
        
        try {
            const nuevaCobranza: Omit<Cobranza, 'id'> = {
                fecha_emision: new Date().toISOString().split('T')[0],
                mes: new Date().toLocaleString('es-AR', { month: 'long' }),
                monto: categoriaSocio.monto,
                estado: 'Pagado',
                recargo: 0,
                descuento: 0,
                socios_id: socio.id,
                cobradores_id: usuario.cobradorId
            };
            await api.addCobranza(nuevaCobranza);
            await cargarDatosCobrador(); // Recargar datos para actualizar la lista
        } catch (error) {
            console.error("Error al registrar pago:", error);
            alert("No se pudo registrar el pago.");
        } finally {
            setPagando(null);
        }
    };
    
    if (loading) return <p className="text-center text-gray-400">Cargando cobranzas pendientes...</p>;

    return (
        <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Socios Pendientes de Cobro en mi Zona</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Dirección</th>
                            <th scope="col" className="px-6 py-3">Monto a Cobrar</th>
                            <th scope="col" className="px-6 py-3">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sociosPorCobrar.length > 0 ? sociosPorCobrar.map(socio => {
                             const categoria = categorias.find(c => c.id === socio.categorias_id);
                             return (
                                <tr key={socio.id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                                    <td className="px-6 py-4 font-medium text-white">{`${socio.nombre} ${socio.apellido}`}</td>
                                    <td className="px-6 py-4">{socio.direccion}</td>
                                    <td className="px-6 py-4">${categoria?.monto.toLocaleString() || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleRegistrarPago(socio)}
                                            disabled={pagando === socio.id}
                                            className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 disabled:bg-gray-500"
                                        >
                                            {pagando === socio.id ? 'Procesando...' : 'Registrar Pago'}
                                        </button>
                                    </td>
                                </tr>
                             );
                        }) : (
                             <tr><td colSpan={4} className="px-6 py-4 text-center">No hay socios con deudas en tu zona.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const Cobranzas: React.FC = () => {
  const { usuario } = useAuth();

  const renderContent = () => {
    switch (usuario?.rol) {
      case 'admin':
        return <AdminCobranzas />;
      case 'cobrador':
        return <CobradorCobranzas />;
      default:
        return (
          <div className="p-6 text-center bg-gray-800 rounded-lg">
            <p className="text-gray-400">No tiene los permisos necesarios para ver esta sección.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-white">Gestión de Cobranzas</h1>
      {renderContent()}
    </div>
  );
};

export default Cobranzas;