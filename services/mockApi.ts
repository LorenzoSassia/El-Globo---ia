
import {
  Socio,
  Actividad,
  InfoCategoriaSocio,
  Cobrador,
  ReporteCobranza,
  ZonaCobranza,
  EstadoSocio,
  Pago,
} from '../types';

let siguienteSocioId = 6;
let siguienteActividadId = 5;
let siguientePagoId = 1;

let sociosMock: Socio[] = [
  { id: 1, nombre: 'Juan', apellido: 'Perez', estado: EstadoSocio.ACTIVO, fechaIngreso: '2022-01-15', fechaNacimiento: '1990-05-20', categoriaId: 'adulto', actividades: [1, 3], tieneCasillero: true, numeroCasillero: 101, zona: ZonaCobranza.CENTRO },
  { id: 2, nombre: 'Maria', apellido: 'Gomez', estado: EstadoSocio.ACTIVO, fechaIngreso: '2021-11-20', fechaNacimiento: '1985-08-10', categoriaId: 'adulto_mayor', actividades: [2], tieneCasillero: false, zona: ZonaCobranza.NORTE },
  { id: 3, nombre: 'Carlos', apellido: 'Lopez', estado: EstadoSocio.MOROSO, fechaIngreso: '2023-02-10', fechaNacimiento: '2005-03-30', categoriaId: 'cadete', actividades: [1, 4], tieneCasillero: true, numeroCasillero: 102, zona: ZonaCobranza.SUR },
  { id: 4, nombre: 'Ana', apellido: 'Martinez', estado: EstadoSocio.ACTIVO, fechaIngreso: '2023-05-01', fechaNacimiento: '1995-12-01', categoriaId: 'adulto', actividades: [2, 3], tieneCasillero: false, zona: ZonaCobranza.NORTE },
  { id: 5, nombre: 'Luis', apellido: 'Rodriguez', estado: EstadoSocio.MOROSO, fechaIngreso: '2020-07-18', fechaNacimiento: '1978-02-25', categoriaId: 'adulto', actividades: [], tieneCasillero: false, zona: ZonaCobranza.CENTRO },
];

let actividadesMock: Actividad[] = [
  { id: 1, nombre: 'Natación', costo: 1500, horario: 'matutino' },
  { id: 2, nombre: 'Gimnasio', costo: 2000, horario: 'vespertino' },
  { id: 3, nombre: 'Tenis', costo: 2500, horario: 'matutino' },
  { id: 4, nombre: 'Yoga', costo: 1800, horario: 'nocturno' },
];

const categoriasMock: InfoCategoriaSocio[] = [
    { id: 'infantil', nombre: 'Infantil (hasta 12 años)', cuota: 1000 },
    { id: 'cadete', nombre: 'Cadete (13 a 17 años)', cuota: 1500 },
    { id: 'adulto', nombre: 'Adulto (18 a 64 años)', cuota: 2500 },
    { id: 'adulto_mayor', nombre: 'Adulto Mayor (65+ años)', cuota: 1200 },
];

const cobradoresMock: Cobrador[] = [
    { id: 1, nombre: 'Roberto Carlos', zona: ZonaCobranza.NORTE },
    { id: 2, nombre: 'Juana de Arco', zona: ZonaCobranza.SUR },
    { id: 3, nombre: 'Pedro Picapiedra', zona: ZonaCobranza.CENTRO },
];

let pagosMock: Pago[] = [];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  getSocios: async (): Promise<Socio[]> => {
    await delay(500);
    return [...sociosMock];
  },
  getSocio: async (id: number): Promise<Socio | undefined> => {
    await delay(300);
    return sociosMock.find(m => m.id === id);
  },
  addSocio: async (socio: Omit<Socio, 'id'>): Promise<Socio> => {
    await delay(500);
    const nuevoSocio = { ...socio, id: siguienteSocioId++ };
    sociosMock.push(nuevoSocio);
    return nuevoSocio;
  },
  updateSocio: async (socio: Socio): Promise<Socio> => {
    await delay(500);
    sociosMock = sociosMock.map(m => m.id === socio.id ? socio : m);
    return socio;
  },
  deleteSocio: async (id: number): Promise<void> => {
    await delay(500);
    sociosMock = sociosMock.filter(m => m.id !== id);
  },
  getActividades: async (): Promise<Actividad[]> => {
    await delay(400);
    return [...actividadesMock];
  },
  addActividad: async (actividad: Omit<Actividad, 'id'>): Promise<Actividad> => {
    await delay(500);
    const nuevaActividad = { ...actividad, id: siguienteActividadId++ };
    actividadesMock.push(nuevaActividad);
    return nuevaActividad;
  },
  updateActividad: async (actividad: Actividad): Promise<Actividad> => {
    await delay(500);
    actividadesMock = actividadesMock.map(a => a.id === actividad.id ? actividad : a);
    return actividad;
  },
  deleteActividad: async (id: number): Promise<void> => {
    await delay(500);
    actividadesMock = actividadesMock.filter(a => a.id !== id);
  },
  getCategoriasSocios: async (): Promise<InfoCategoriaSocio[]> => {
    await delay(200);
    return [...categoriasMock];
  },
  getCobradores: async (): Promise<Cobrador[]> => {
      await delay(200);
      return [...cobradoresMock];
  },
  getCobradorPorNombre: async (nombre: string): Promise<Cobrador | undefined> => {
    await delay(100);
    return cobradoresMock.find(c => c.nombre.toLowerCase() === nombre.toLowerCase());
  },
  getReporteCobranza: async (cobradorId: number): Promise<ReporteCobranza> => {
      await delay(1000);
      const cobrador = cobradoresMock.find(c => c.id === cobradorId);
      if (!cobrador) throw new Error("Cobrador no encontrado");

      const sociosAsignados = sociosMock.filter(m => m.zona === cobrador.zona);

      const monto = sociosAsignados
        .filter(m => m.estado === EstadoSocio.MOROSO)
        .reduce((sum, socio) => {
            const categoria = categoriasMock.find(c => c.id === socio.categoriaId);
            return sum + (categoria?.cuota || 0);
        }, 0);
        
      const comision = monto * 0.10;
      const neto = monto - comision;
      
      return { cobradorId, monto, comision, neto };
  },
  getPagos: async (): Promise<Pago[]> => {
      await delay(300);
      return [...pagosMock];
  },
  registrarPago: async (datosPago: Omit<Pago, 'id'>): Promise<Pago> => {
      await delay(600);
      const nuevoPago = { ...datosPago, id: siguientePagoId++ };
      pagosMock.push(nuevoPago);

      const indiceSocio = sociosMock.findIndex(m => m.id === datosPago.socioId);
      if (indiceSocio !== -1) {
          sociosMock[indiceSocio].estado = EstadoSocio.ACTIVO;
      }
      return nuevoPago;
  }
};
