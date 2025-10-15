// FIX: Replaced outdated English type names (Member, Activity, etc.) with the correct Spanish types from ../types.ts
import {
  Socio,
  Actividad,
  Categoria,
  Cobrador,
  ReporteCobranza,
  Zona,
  EstadoSocio,
  Cobranza,
  Usuario,
  Casillero,
} from '../types';

let nextSocioId = 6;
let nextActivityId = 5;
let nextCobranzaId = 1;

// --- MOCK DATA (Updated to match new types) ---

const mockZonas: Zona[] = [
    { id: 1, zona: 'Centro' },
    { id: 2, zona: 'Norte' },
    { id: 3, zona: 'Sur' },
];

let mockActividades: Actividad[] = [
  // FIX: field `schedule` renamed to `turno` and values updated
  { id: 1, nombre: 'Natación', costo: 1500, turno: 'Mañana' },
  { id: 2, nombre: 'Gimnasio', costo: 2000, turno: 'Tarde' },
  { id: 3, nombre: 'Tenis', costo: 2500, turno: 'Mañana' },
  { id: 4, nombre: 'Yoga', costo: 1800, turno: 'Noche' },
];

const mockCategorias: Categoria[] = [
    // FIX: field `fee` renamed to `monto` and `id` is now a number
    { id: 1, nombre: 'Infantil (hasta 12 años)', monto: 1000 },
    { id: 2, nombre: 'Cadete (13 a 17 años)', monto: 1500 },
    { id: 3, nombre: 'Adulto (18 a 64 años)', monto: 2500 },
    { id: 4, nombre: 'Adulto Mayor (65+ años)', monto: 1200 },
];

const mockCobradores: Cobrador[] = [
    // FIX: field `zone` renamed to `zonas_id`
    { id: 1, nombre: 'Roberto Carlos', zonas_id: 2 }, // Norte
    { id: 2, nombre: 'Juana de Arco', zonas_id: 3 },   // Sur
    { id: 3, nombre: 'Pedro Picapiedra', zonas_id: 1 },// Centro
];

let mockCasilleros: Casillero[] = [
    { id: 101, nro_casillero: 101, estado: 'Ocupado', monto_mensual: 500 },
    { id: 102, nro_casillero: 102, estado: 'Ocupado', monto_mensual: 500 },
    { id: 103, nro_casillero: 103, estado: 'Libre', monto_mensual: 500 },
];

let mockSocios: Socio[] = [
  // FIX: Updated `mockMembers` to `mockSocios` with the correct `Socio` type structure
  { id: 1, nombre: 'Juan', apellido: 'Perez', status: EstadoSocio.PAGO, fecha_alta: '2022-01-15', fecha_nacimiento: '1990-05-20', categorias_id: 3, actividades: [mockActividades[0], mockActividades[2]], casilleros_id: 101, zonas_id: 1, dni: '11111111', direccion: 'Calle Falsa 123', telefono: '123456789', email: 'juan@perez.com' },
  { id: 2, nombre: 'Maria', apellido: 'Gomez', status: EstadoSocio.PAGO, fecha_alta: '2021-11-20', fecha_nacimiento: '1985-08-10', categorias_id: 4, actividades: [mockActividades[1]], casilleros_id: undefined, zonas_id: 2, dni: '22222222', direccion: 'Avenida Siempreviva 742', telefono: '987654321', email: 'maria@gomez.com' },
  { id: 3, nombre: 'Carlos', apellido: 'Lopez', status: EstadoSocio.DEBE, fecha_alta: '2023-02-10', fecha_nacimiento: '2005-03-30', categorias_id: 2, actividades: [mockActividades[0], mockActividades[3]], casilleros_id: 102, zonas_id: 3, dni: '33333333', direccion: 'Boulevard de los Sueños Rotos', telefono: '112233445', email: 'carlos@lopez.com' },
  { id: 4, nombre: 'Ana', apellido: 'Martinez', status: EstadoSocio.PAGO, fecha_alta: '2023-05-01', fecha_nacimiento: '1995-12-01', categorias_id: 3, actividades: [mockActividades[1], mockActividades[2]], casilleros_id: undefined, zonas_id: 2, dni: '44444444', direccion: 'Plaza de la Constitución', telefono: '556677889', email: 'ana@martinez.com' },
  { id: 5, nombre: 'Luis', apellido: 'Rodriguez', status: EstadoSocio.DEBE, fecha_alta: '2020-07-18', fecha_nacimiento: '1978-02-25', categorias_id: 3, actividades: [], casilleros_id: undefined, zonas_id: 1, dni: '55555555', direccion: 'Ruta 66', telefono: '101010101', email: 'luis@rodriguez.com' },
];

let mockCobranzas: Cobranza[] = [];

// FIX: Added mock users for login functionality
const mockUsuarios: (Usuario & {contrasena: string})[] = [
    {id: 1, usuario: 'admin', contrasena: 'admin', rol: 'admin'},
    {id: 2, usuario: 'socio1', contrasena: 'socio1', rol: 'socio', socioId: 1},
    {id: 3, usuario: 'cobrador1', contrasena: 'cobrador1', rol: 'cobrador', cobradorId: 1, zonaId: 2}, // Roberto Carlos, Zona Norte
];


const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// FIX: Renamed methods to align with services/api.ts and updated logic to use correct types
export const mockApi = {
  // Auth
  login: async (usuario: string, contrasena: string): Promise<Usuario> => {
    await delay(500);
    const user = mockUsuarios.find(u => u.usuario === usuario && u.contrasena === contrasena);
    if (user) {
        const { contrasena, ...userData } = user;
        return userData;
    }
    throw new Error('Credenciales inválidas');
  },

  // Socios
  getSocios: async (): Promise<Socio[]> => {
    await delay(500);
    return [...mockSocios];
  },
  getSocio: async (id: number): Promise<Socio | undefined> => {
    await delay(300);
    const socio = mockSocios.find(m => m.id === id);
    if (socio) {
        // Return a copy to prevent direct mutation of the mock data
        return { ...socio };
    }
    return undefined;
  },
  addSocio: async (socio: Omit<Socio, 'id'>): Promise<Socio> => {
    await delay(500);
    const newSocio = { ...socio, id: nextSocioId++ };
    mockSocios.push(newSocio);
    return newSocio;
  },
  updateSocio: async (id: number, socioData: Partial<Socio>): Promise<Socio> => {
    await delay(500);
    let updatedSocio: Socio | undefined;
    mockSocios = mockSocios.map(s => {
      if (s.id === id) {
        updatedSocio = { ...s, ...socioData };
        return updatedSocio;
      }
      return s;
    });
    if (!updatedSocio) throw new Error("Socio not found");
    return updatedSocio;
  },
  deleteSocio: async (id: number): Promise<void> => {
    await delay(500);
    mockSocios = mockSocios.filter(m => m.id !== id);
  },

  // Actividades
  getActividades: async (): Promise<Actividad[]> => {
    await delay(400);
    return [...mockActividades];
  },
  addActividad: async (activity: Omit<Actividad, 'id'>): Promise<Actividad> => {
    await delay(500);
    const newActivity = { ...activity, id: nextActivityId++ };
    mockActividades.push(newActivity);
    return newActivity;
  },
  updateActividad: async (id: number, activityData: Partial<Actividad>): Promise<Actividad> => {
    await delay(500);
    let updatedActividad: Actividad | undefined;
    mockActividades = mockActividades.map(a => {
      if (a.id === id) {
        updatedActividad = { ...a, ...activityData };
        return updatedActividad;
      }
      return a;
    });
    if (!updatedActividad) throw new Error("Actividad not found");
    return updatedActividad;
  },
  deleteActividad: async (id: number): Promise<void> => {
    await delay(500);
    mockActividades = mockActividades.filter(a => a.id !== id);
  },
  inscribirSocioActividad: async (socioId: number, actividadId: number): Promise<void> => {
    await delay(300);
    const socio = mockSocios.find(s => s.id === socioId);
    const actividad = mockActividades.find(a => a.id === actividadId);
    if (socio && actividad) {
        if (!socio.actividades) socio.actividades = [];
        if (!socio.actividades.some(a => a.id === actividadId)) {
            socio.actividades.push(actividad);
        }
    } else {
        throw new Error("Socio o actividad no encontrados");
    }
  },
  desinscribirSocioActividad: async (socioId: number, actividadId: number): Promise<void> => {
    await delay(300);
    const socio = mockSocios.find(s => s.id === socioId);
    if (socio && socio.actividades) {
        socio.actividades = socio.actividades.filter(a => a.id !== actividadId);
    } else {
        throw new Error("Socio o actividad no encontrados");
    }
  },

  // Categorias
  getCategorias: async (): Promise<Categoria[]> => {
    await delay(200);
    return [...mockCategorias];
  },

  // Zonas
  getZonas: async (): Promise<Zona[]> => {
    await delay(100);
    return [...mockZonas];
  },

  // Cobradores
  getCobradores: async (): Promise<Cobrador[]> => {
      await delay(200);
      return [...mockCobradores];
  },

  // Cobranzas
  getReporteCobranza: async (cobradorId: number): Promise<ReporteCobranza> => {
      await delay(1000);
      const cobrador = mockCobradores.find(c => c.id === cobradorId);
      if (!cobrador) throw new Error("Collector not found");

      const sociosAsignados = mockSocios.filter(m => m.zonas_id === cobrador.zonas_id);

      const montoACobrar = sociosAsignados
        .filter(m => m.status === EstadoSocio.DEBE)
        .reduce((sum, socio) => {
            const categoria = mockCategorias.find(c => c.id === socio.categorias_id);
            return sum + (categoria?.monto || 0);
        }, 0);
        
      const comision = montoACobrar * 0.10;
      const netoARendir = montoACobrar - comision;
      
      return { cobradorId, montoACobrar, comision, netoARendir };
  },
  getCobranzas: async (): Promise<Cobranza[]> => {
      await delay(300);
      return [...mockCobranzas];
  },
  addCobranza: async (cobranzaData: Omit<Cobranza, 'id'>): Promise<Cobranza> => {
      await delay(600);
      const newCobranza = { ...cobranzaData, id: nextCobranzaId++ };
      mockCobranzas.push(newCobranza);

      const socioIndex = mockSocios.findIndex(m => m.id === cobranzaData.socios_id);
      if (socioIndex !== -1) {
          mockSocios[socioIndex].status = EstadoSocio.PAGO;
      }
      return newCobranza;
  },

  // Casilleros
  getCasilleros: async (): Promise<Casillero[]> => {
    await delay(200);
    return [...mockCasilleros];
  },
  updateCasillero: async (id: number, casilleroData: Partial<Casillero>): Promise<Casillero> => {
    await delay(300);
    let updatedCasillero: Casillero | undefined;
    mockCasilleros = mockCasilleros.map(c => {
        if (c.id === id) {
            updatedCasillero = { ...c, ...casilleroData };
            return updatedCasillero;
        }
        return c;
    });
    if (!updatedCasillero) throw new Error("Casillero no encontrado");
    return updatedCasillero;
  },
};
