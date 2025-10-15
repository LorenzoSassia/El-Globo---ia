
import React, { useState, useEffect } from 'react';
import { Socio, InfoCategoriaSocio, Actividad, EstadoSocio, ZonaCobranza } from '../../types';
import { mockApi } from '../../services/mockApi';

interface SocioModalProps {
  estaAbierto: boolean;
  alCerrar: () => void;
  alGuardar: (socio: Socio | Omit<Socio, 'id'>) => void;
  socio: Socio | null;
}

const SocioModal: React.FC<SocioModalProps> = ({ estaAbierto, alCerrar, alGuardar, socio }) => {
  const estadoInicialFormulario: Omit<Socio, 'id'> = {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: EstadoSocio.ACTIVO,
    categoriaId: '',
    actividades: [],
    tieneCasillero: false,
    numeroCasillero: undefined,
    zona: ZonaCobranza.CENTRO,
  };
  
  const [datosFormulario, setDatosFormulario] = useState<Omit<Socio, 'id'>>(estadoInicialFormulario);
  const [categorias, setCategorias] = useState<InfoCategoriaSocio[]>([]);
  const [todasLasActividades, setTodasLasActividades] = useState<Actividad[]>([]);

  useEffect(() => {
    if (estaAbierto) {
      mockApi.getCategoriasSocios().then(setCategorias);
      mockApi.getActividades().then(setTodasLasActividades);
      if (socio) {
        setDatosFormulario({
          nombre: socio.nombre,
          apellido: socio.apellido,
          fechaNacimiento: socio.fechaNacimiento,
          fechaIngreso: socio.fechaIngreso,
          estado: socio.estado,
          categoriaId: socio.categoriaId,
          actividades: [...socio.actividades],
          tieneCasillero: socio.tieneCasillero,
          numeroCasillero: socio.numeroCasillero,
          zona: socio.zona,
        });
      } else {
        setDatosFormulario(estadoInicialFormulario);
      }
    }
  }, [socio, estaAbierto]);

  if (!estaAbierto) return null;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        if (name === 'tieneCasillero') {
            setDatosFormulario(prev => ({ ...prev, tieneCasillero: checked, numeroCasillero: checked ? prev.numeroCasillero : undefined }));
        } else {
            setDatosFormulario(prev => ({ ...prev, [name]: checked }));
        }
    } else {
        const val = (name === 'zona' || name === 'numeroCasillero') ? (value === '' ? undefined : Number(value)) : value;
        setDatosFormulario(prev => ({ ...prev, [name]: val }));
    }
  };
  
  const manejarCambioActividad = (actividadId: number) => {
      setDatosFormulario(prev => {
          const nuevasActividades = prev.actividades.includes(actividadId)
            ? prev.actividades.filter(id => id !== actividadId)
            : [...prev.actividades, actividadId];
          return { ...prev, actividades: nuevasActividades };
      });
  }

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (datosFormulario.tieneCasillero && (datosFormulario.numeroCasillero === undefined || datosFormulario.numeroCasillero <= 0)) {
        alert('Por favor, ingrese un número de casillero válido.');
        return;
    }
    if (socio) {
        alGuardar({ ...datosFormulario, id: socio.id });
    } else {
        alGuardar(datosFormulario);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white">{socio ? 'Editar Socio' : 'Nuevo Socio'}</h2>
        <form onSubmit={manejarSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="nombre" value={datosFormulario.nombre} onChange={manejarCambio} placeholder="Nombre" className="input-style" required />
            <input type="text" name="apellido" value={datosFormulario.apellido} onChange={manejarCambio} placeholder="Apellido" className="input-style" required />
            <input type="date" name="fechaNacimiento" value={datosFormulario.fechaNacimiento} onChange={manejarCambio} placeholder="Fecha de Nacimiento" className="input-style" required />
            <input type="date" name="fechaIngreso" value={datosFormulario.fechaIngreso} onChange={manejarCambio} placeholder="Fecha de Ingreso" className="input-style" required />
            <select name="estado" value={datosFormulario.estado} onChange={manejarCambio} className="input-style">
              {Object.values(EstadoSocio).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="categoriaId" value={datosFormulario.categoriaId} onChange={manejarCambio} className="input-style" required>
              <option value="">Seleccione Categoría</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
             <select name="zona" value={datosFormulario.zona} onChange={manejarCambio} className="col-span-1 md:col-span-2 input-style" required>
                <option value="">Seleccione Zona de Cobranza</option>
                {Object.keys(ZonaCobranza).filter(key => !isNaN(Number(key))).map(key => (
                    <option key={key} value={key}>{ZonaCobranza[Number(key)]}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Actividades</label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-700 rounded-md md:grid-cols-3">
              {todasLasActividades.map(act => (
                <label key={act.id} className="flex items-center space-x-2 text-white">
                  <input type="checkbox" checked={datosFormulario.actividades.includes(act.id)} onChange={() => manejarCambioActividad(act.id)} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"/>
                  <span>{act.nombre}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center">
             <input type="checkbox" name="tieneCasillero" checked={datosFormulario.tieneCasillero} onChange={manejarCambio} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500" />
             <label className="ml-2 text-white">¿Tiene Casillero?</label>
          </div>
          {datosFormulario.tieneCasillero && (
            <div className="mt-2">
                <input type="number" name="numeroCasillero" value={datosFormulario.numeroCasillero || ''} onChange={manejarCambio} placeholder="Número de Casillero" className="input-style" required />
            </div>
          )}
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={alCerrar} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
        <style>{`.input-style { width: 100%; padding: 0.75rem; color: white; background-color: #374151; border: 1px solid #4B5563; border-radius: 0.375rem; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3B82F6; }`}</style>
      </div>
    </div>
  );
};

export default SocioModal;
