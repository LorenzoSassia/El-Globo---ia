export enum MemberCategory {
  CADETE = 'cadete',
  ACTIVO_MASCULINO = 'activo_masculino',
  ACTIVO_FEMENINO = 'activo_femenino',
  VITALICIO = 'vitalicio',
  GRUPO_FAMILIAR = 'grupo_familiar'
}

export interface MemberCategoryInfo {
  id: MemberCategory;
  name: string;
  fee: number;
}

export enum CollectionZone {
  CLUB = 0,
  PEREZ = 1,
  GARCIA = 2,
  RODRIGUEZ = 3
}

export enum MemberStatus {
    ACTIVE = 'activo',
    DELINQUENT = 'moroso',
    INACTIVE = 'inactivo'
}

export enum UserRole {
  ADMIN = 'admin',
  COBRADOR = 'cobrador',
  SOCIO = 'socio'
}

export interface User {
  username: string;
  role: UserRole;
  memberId?: number; // for socio role
}


export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // YYYY-MM-DD
  joinDate: string; // YYYY-MM-DD
  categoryId: MemberCategory;
  familyGroupId?: number;
  collectionZone: CollectionZone;
  status: MemberStatus;
  activities: number[]; // array of activity IDs
  hasLocker: boolean;
}

export interface Activity {
  id: number;
  name: string;
  cost: number;
  schedule: 'matutino' | 'vespertino' | 'nocturno';
}

export interface Locker {
  id: number;
  memberId: number | null;
}

export interface Collector {
  id: number;
  name: string;
  zone: CollectionZone;
}

export interface CollectionReport {
    collectorId: number;
    amount: number;
    commission: number;
    net: number;
}
