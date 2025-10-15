
export enum RolUsuario {
  ADMIN = 'admin',
  COBRADOR = 'cobrador',
  SOCIO = 'socio',
}

export interface Usuario {
  nombreUsuario: string;
  rol: RolUsuario;
  socioId?: number;
  cobradorId?: number;
  zona?: ZonaCobranza;
}

export enum EstadoSocio {
  ACTIVO = 'activo',
  MOROSO = 'moroso',
  INACTIVO = 'inactivo',
}

export interface Socio {
  id: number;
  nombre: string;
  apellido: string;
  estado: EstadoSocio;
  fechaIngreso: string; // "YYYY-MM-DD"
  fechaNacimiento: string; // "YYYY-MM-DD"
  categoriaId: string;
  actividades: number[];
  tieneCasillero: boolean;
  numeroCasillero?: number;
  zona: ZonaCobranza;
}

export interface Actividad {
  id: number;
  nombre: string;
  costo: number;
  horario: 'matutino' | 'vespertino' | 'nocturno';
}

export interface InfoCategoriaSocio {
  id: string;
  nombre: string;
  cuota: number;
}

export enum ZonaCobranza {
  NORTE,
  SUR,
  ESTE,
  OESTE,
  CENTRO,
}

export interface Cobrador {
    id: number;
    nombre: string;
    zona: ZonaCobranza;
}

export interface ReporteCobranza {
    cobradorId: number;
    monto: number;
    comision: number;
    neto: number;
}

export interface Pago {
    id: number;
    socioId: number;
    cobradorId: number;
    monto: number;
    fecha: string; // "YYYY-MM-DD"
}
