
import {
  Member,
  Activity,
  MemberCategoryInfo,
  Collector,
  CollectionReport,
  CollectionZone,
  MemberStatus,
} from '../types';

let nextMemberId = 6;
let nextActivityId = 5;

let mockMembers: Member[] = [
  { id: 1, firstName: 'Juan', lastName: 'Perez', status: MemberStatus.ACTIVE, joinDate: '2022-01-15', birthDate: '1990-05-20', categoryId: 'adulto', activities: [1, 3], hasLocker: true },
  { id: 2, firstName: 'Maria', lastName: 'Gomez', status: MemberStatus.ACTIVE, joinDate: '2021-11-20', birthDate: '1985-08-10', categoryId: 'adulto_mayor', activities: [2], hasLocker: false },
  { id: 3, firstName: 'Carlos', lastName: 'Lopez', status: MemberStatus.DELINQUENT, joinDate: '2023-02-10', birthDate: '2005-03-30', categoryId: 'cadete', activities: [1, 4], hasLocker: true },
  { id: 4, firstName: 'Ana', lastName: 'Martinez', status: MemberStatus.ACTIVE, joinDate: '2023-05-01', birthDate: '1995-12-01', categoryId: 'adulto', activities: [2, 3], hasLocker: false },
  { id: 5, firstName: 'Luis', lastName: 'Rodriguez', status: MemberStatus.INACTIVE, joinDate: '2020-07-18', birthDate: '1978-02-25', categoryId: 'adulto', activities: [], hasLocker: false },
];

let mockActivities: Activity[] = [
  { id: 1, name: 'Natación', cost: 1500, schedule: 'matutino' },
  { id: 2, name: 'Gimnasio', cost: 2000, schedule: 'vespertino' },
  { id: 3, name: 'Tenis', cost: 2500, schedule: 'matutino' },
  { id: 4, name: 'Yoga', cost: 1800, schedule: 'nocturno' },
];

const mockCategories: MemberCategoryInfo[] = [
    { id: 'infantil', name: 'Infantil (hasta 12 años)', fee: 1000 },
    { id: 'cadete', name: 'Cadete (13 a 17 años)', fee: 1500 },
    { id: 'adulto', name: 'Adulto (18 a 64 años)', fee: 2500 },
    { id: 'adulto_mayor', name: 'Adulto Mayor (65+ años)', fee: 1200 },
];

const mockCollectors: Collector[] = [
    { id: 1, name: 'Roberto Carlos', zone: CollectionZone.NORTE },
    { id: 2, name: 'Juana de Arco', zone: CollectionZone.SUR },
    { id: 3, name: 'Pedro Picapiedra', zone: CollectionZone.CENTRO },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  getMembers: async (): Promise<Member[]> => {
    await delay(500);
    return [...mockMembers];
  },
  getMember: async (id: number): Promise<Member | undefined> => {
    await delay(300);
    return mockMembers.find(m => m.id === id);
  },
  addMember: async (member: Omit<Member, 'id'>): Promise<Member> => {
    await delay(500);
    const newMember = { ...member, id: nextMemberId++ };
    mockMembers.push(newMember);
    return newMember;
  },
  updateMember: async (member: Member): Promise<Member> => {
    await delay(500);
    mockMembers = mockMembers.map(m => m.id === member.id ? member : m);
    return member;
  },
  deleteMember: async (id: number): Promise<void> => {
    await delay(500);
    mockMembers = mockMembers.filter(m => m.id !== id);
  },
  getActivities: async (): Promise<Activity[]> => {
    await delay(400);
    return [...mockActivities];
  },
  addActivity: async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    await delay(500);
    const newActivity = { ...activity, id: nextActivityId++ };
    mockActivities.push(newActivity);
    return newActivity;
  },
  updateActivity: async (activity: Activity): Promise<Activity> => {
    await delay(500);
    mockActivities = mockActivities.map(a => a.id === activity.id ? activity : a);
    return activity;
  },
  deleteActivity: async (id: number): Promise<void> => {
    await delay(500);
    mockActivities = mockActivities.filter(a => a.id !== id);
  },
  getMemberCategories: async (): Promise<MemberCategoryInfo[]> => {
    await delay(200);
    return [...mockCategories];
  },
  getCollectors: async (): Promise<Collector[]> => {
      await delay(200);
      return [...mockCollectors];
  },
  getCollectionReport: async (collectorId: number): Promise<CollectionReport> => {
      await delay(1000);
      const collector = mockCollectors.find(c => c.id === collectorId);
      if (!collector) throw new Error("Collector not found");

      // Super simplified logic: just sum fees of some members
      const amount = mockMembers
        .filter(m => m.status !== MemberStatus.INACTIVE)
        .slice(0, 3)
        .reduce((sum, member) => {
            const category = mockCategories.find(c => c.id === member.categoryId);
            return sum + (category?.fee || 0);
        }, 0);
        
      const commission = amount * 0.10;
      const net = amount - commission;
      
      return { collectorId, amount, commission, net };
  }
};
