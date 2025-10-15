// types.ts

// Basado en la tabla 'usuarios'
export interface Usuario {
  id: number;
  usuario: string;
  rol: 'admin' | 'socio' | 'cobrador';
  socioId?: number;
  cobradorId?: number;
  zonaId?: number;
}

// Basado en la tabla 'socios'
export enum EstadoSocio {
  PAGO = 'Pago',
  DEBE = 'Debe',
  INACTIVO = 'Inactivo',
}

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string; // "YYYY-MM-DD"
  direccion: string;
  telefono: string;
  email: string;
  fecha_alta: string; // "YYYY-MM-DD"
  status: EstadoSocio;
  casilleros_id?: number;
  categorias_id: number;
  zonas_id: number;
  actividades?: Actividad[]; // Se poblará por separado
}

// Basado en la tabla 'actividades'
export interface Actividad {
  id: number;
  nombre: string;
  costo: number;
  turno: string; // "Mañana", "Tarde", "Noche", "Mañana - Tarde"
}

// Basado en la tabla 'categorias'
export interface Categoria {
  id: number;
  nombre: string;
  monto: number;
}

// Basado en la tabla 'zonas'
export interface Zona {
    id: number;
    zona: string;
}

// Basado en la tabla 'cobradores'
export interface Cobrador {
    id: number;
    nombre: string;
    zonas_id: number;
}

// Basado en la tabla 'cobranzas'
export interface Cobranza {
    id: number;
    fecha_emision: string; // "YYYY-MM-DD"
    mes: string;
    monto: number;
    estado: string;
    recargo: number;
    descuento: number;
    socios_id: number;
    cobradores_id: number;
}

// Basado en la tabla 'casilleros'
export interface Casillero {
    id: number;
    nro_casillero: number;
    estado: 'Ocupado' | 'Libre';
    monto_mensual: number;
    socio?: Socio; // Para mostrar quién lo ocupa
}


// Tipos para la UI que no son directamente de la DB
export interface ReporteCobranza {
    cobradorId: number;
    montoACobrar: number;
    comision: number;
    netoARendir: number;
}
