export enum UserRole {
  ADMIN = 'admin',
  COBRADOR = 'cobrador',
  SOCIO = 'socio',
}

export interface User {
  username: string;
  role: UserRole;
  memberId?: number;
  collectorId?: number;
  zone?: CollectionZone;
}

export enum MemberStatus {
  ACTIVE = 'activo',
  DELINQUENT = 'moroso',
  INACTIVE = 'inactivo',
}

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  status: MemberStatus;
  joinDate: string; // "YYYY-MM-DD"
  birthDate: string; // "YYYY-MM-DD"
  categoryId: string;
  activities: number[];
  hasLocker: boolean;
  lockerNumber?: number;
  zone: CollectionZone;
}

export interface Activity {
  id: number;
  name: string;
  cost: number;
  schedule: 'matutino' | 'vespertino' | 'nocturno';
}

export interface MemberCategoryInfo {
  id: string;
  name: string;
  fee: number;
}

export enum CollectionZone {
  NORTE,
  SUR,
  ESTE,
  OESTE,
  CENTRO,
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

export interface Payment {
    id: number;
    memberId: number;
    collectorId: number;
    amount: number;
    date: string; // "YYYY-MM-DD"
}