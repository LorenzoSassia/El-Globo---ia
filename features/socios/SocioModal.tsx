import React, { useState, useEffect } from 'react';
import { Socio, Categoria, Actividad, EstadoSocio, Zona } from '../../types';
import { api } from '../../services/api';

interface SocioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (socio: Socio | Omit<Socio, 'id'>) => void;
  socio: Socio | null;
}

const SocioModal: React.FC<SocioModalProps> = ({ isOpen, onClose, onSave, socio }) => {
  const initialFormState = {
    nombre: '',
    apellido: '',
    dni: '',
    fecha_nacimiento: '',
    direccion: '',
    telefono: '',
    email: '',
    fecha_alta: new Date().toISOString().split('T')[0],
    status: EstadoSocio.PAGO,
    categorias_id: 0,
    zonas_id: 0,
    casilleros_id: undefined,
    actividades: [],
  };
  
  const [formData, setFormData] = useState<Omit<Socio, 'id'>>(initialFormState);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [todasLasActividades, setTodasLasActividades] = useState<Actividad[]>([]);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [tieneCasillero, setTieneCasillero] = useState(false);

  useEffect(() => {
    if (isOpen) {
      Promise.all([
          api.getCategorias(), 
          api.getActividades(), 
          api.getZonas()
      ]).then(([cats, acts, zns]) => {
          setCategorias(cats as Categoria[]);
          setTodasLasActividades(acts as Actividad[]);
          setZonas(zns as Zona[]);
      });

      if (socio) {
        setFormData({
            nombre: socio.nombre,
            apellido: socio.apellido,
            dni: socio.dni,
            fecha_nacimiento: socio.fecha_nacimiento,
            direccion: socio.direccion,
            telefono: socio.telefono,
            email: socio.email,
            fecha_alta: socio.fecha_alta,
            status: socio.status,
            categorias_id: socio.categorias_id,
            zonas_id: socio.zonas_id,
            casilleros_id: socio.casilleros_id,
            actividades: socio.actividades || [],
        });
        setTieneCasillero(!!socio.casilleros_id);
      } else {
        setFormData(initialFormState);
        setTieneCasillero(false);
      }
    }
  }, [socio, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = name === 'categorias_id' || name === 'zonas_id' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  
  const handleActivityChange = (actividadId: number) => {
      setFormData(prev => {
          const actividadesActuales = prev.actividades || [];
          const newActivities = actividadesActuales.some(a => a.id === actividadId)
            ? actividadesActuales.filter(a => a.id !== actividadId)
            : [...actividadesActuales, todasLasActividades.find(a => a.id === actividadId)!];
          return { ...prev, actividades: newActivities };
      });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categorias_id || !formData.zonas_id) {
        alert("Por favor, seleccione categoría y zona.");
        return;
    }
    const dataToSave = { ...formData };
    if (!tieneCasillero) {
        dataToSave.casilleros_id = undefined;
    }

    if (socio) {
        onSave({ ...dataToSave, id: socio.id });
    } else {
        onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white">{socio ? 'Editar Socio' : 'Nuevo Socio'}</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" className="input-style" required />
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido" className="input-style" required />
            <input type="text" name="dni" value={formData.dni} onChange={handleChange} placeholder="DNI" className="input-style" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-style" required />
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" className="input-style" required />
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección" className="input-style" required />
            <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} placeholder="Fecha de Nacimiento" className="input-style" required />
            <input type="date" name="fecha_alta" value={formData.fecha_alta} onChange={handleChange} placeholder="Fecha de Ingreso" className="input-style" required />
            <select name="status" value={formData.status} onChange={handleChange} className="input-style">
              {Object.values(EstadoSocio).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select name="categorias_id" value={formData.categorias_id} onChange={handleChange} className="input-style" required>
              <option value={0}>Seleccione Categoría</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
             <select name="zonas_id" value={formData.zonas_id} onChange={handleChange} className="col-span-1 md:col-span-2 input-style" required>
                <option value={0}>Seleccione Zona de Cobranza</option>
                {zonas.map(z => <option key={z.id} value={z.id}>{z.zona}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">Actividades</label>
            <div className="grid grid-cols-2 gap-2 p-3 bg-gray-700 rounded-md md:grid-cols-3">
              {todasLasActividades.map(act => (
                <label key={act.id} className="flex items-center space-x-2 text-white">
                  <input type="checkbox" checked={formData.actividades?.some(a => a.id === act.id)} onChange={() => handleActivityChange(act.id)} className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"/>
                  <span>{act.nombre}</span>
                </label>
              ))}
            </div>
          </div>
         {/* No se permite asignar casillero desde aquí para simplificar. Se hace en la sección Casilleros */}
          <div className="flex justify-end pt-4 space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Guardar</button>
          </div>
        </form>
        <style>{`.input-style { width: 100%; padding: 0.75rem; color: white; background-color: #374151; border: 1px solid #4B5563; border-radius: 0.375rem; } .input-style:focus { outline: none; box-shadow: 0 0 0 2px #3B82F6; }`}</style>
      </div>
    </div>
  );
};

export default SocioModal;
