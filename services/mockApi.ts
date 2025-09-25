import {
  Member,
  Activity,
  Locker,
  Collector,
  MemberCategory,
  CollectionZone,
  MemberStatus,
  MemberCategoryInfo,
  CollectionReport
} from '../types';

let members: Member[] = [
    { id: 1, firstName: 'Juan', lastName: 'Perez', birthDate: '1985-05-15', joinDate: '2020-01-10', categoryId: MemberCategory.ACTIVO_MASCULINO, collectionZone: CollectionZone.PEREZ, status: MemberStatus.ACTIVE, activities: [1], hasLocker: true, familyGroupId: undefined },
    { id: 2, firstName: 'Maria', lastName: 'Gomez', birthDate: '1992-08-22', joinDate: '2021-03-20', categoryId: MemberCategory.ACTIVO_FEMENINO, collectionZone: CollectionZone.GARCIA, status: MemberStatus.ACTIVE, activities: [2], hasLocker: false, familyGroupId: undefined },
    { id: 3, firstName: 'Carlos', lastName: 'Rodriguez', birthDate: '2005-11-30', joinDate: '2022-02-15', categoryId: MemberCategory.CADETE, collectionZone: CollectionZone.RODRIGUEZ, status: MemberStatus.DELINQUENT, activities: [1], hasLocker: false, familyGroupId: undefined },
];
let activities: Activity[] = [
    { id: 1, name: 'Fútbol', cost: 500, schedule: 'vespertino' },
    { id: 2, name: 'Natación', cost: 700, schedule: 'matutino' },
];
let lockers: Locker[] = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, memberId: i === 0 ? 1 : null }));
let collectors: Collector[] = [
    { id: 1, name: 'Cobrador Perez', zone: CollectionZone.PEREZ },
    { id: 2, name: 'Cobrador Garcia', zone: CollectionZone.GARCIA },
    { id: 3, name: 'Cobrador Rodriguez', zone: CollectionZone.RODRIGUEZ },
];

const memberCategories: MemberCategoryInfo[] = [
  { id: MemberCategory.CADETE, name: 'Cadete', fee: 1000 },
  { id: MemberCategory.ACTIVO_MASCULINO, name: 'Activo Masculino', fee: 2000 },
  { id: MemberCategory.ACTIVO_FEMENINO, name: 'Activo Femenino', fee: 1800 },
  { id: MemberCategory.VITALICIO, name: 'Vitalicio', fee: 0 },
  { id: MemberCategory.GRUPO_FAMILIAR, name: 'Grupo Familiar', fee: 3500 },
];

let nextMemberId = members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1;
let nextActivityId = activities.length > 0 ? Math.max(...activities.map(a => a.id)) + 1 : 1;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  // Members
  getMembers: async (): Promise<Member[]> => {
    await delay(500);
    return [...members];
  },
  getMember: async (id: number): Promise<Member | undefined> => {
    await delay(300);
    return members.find(m => m.id === id);
  },
  addMember: async (memberData: Omit<Member, 'id'>): Promise<Member> => {
    await delay(500);
    const newMember: Member = { ...memberData, id: nextMemberId++ };
    members.push(newMember);
    return newMember;
  },
  updateMember: async (memberData: Member): Promise<Member> => {
    await delay(500);
    members = members.map(m => (m.id === memberData.id ? memberData : m));
    return memberData;
  },
  deleteMember: async (id: number): Promise<void> => {
    await delay(500);
    members = members.filter(m => m.id !== id);
  },

  // Activities
  getActivities: async (): Promise<Activity[]> => {
    await delay(500);
    return [...activities];
  },
  addActivity: async (activityData: Omit<Activity, 'id'>): Promise<Activity> => {
    await delay(500);
    const newActivity: Activity = { ...activityData, id: nextActivityId++ };
    activities.push(newActivity);
    return newActivity;
  },
  updateActivity: async (activityData: Activity): Promise<Activity> => {
    await delay(500);
    activities = activities.map(a => (a.id === activityData.id ? activityData : a));
    return activityData;
  },
  deleteActivity: async (id: number): Promise<void> => {
    await delay(500);
    activities = activities.filter(a => a.id !== id);
  },

  // Lockers
  getLockers: async (): Promise<Locker[]> => {
    await delay(500);
    return [...lockers];
  },

  // Collectors
  getCollectors: async (): Promise<Collector[]> => {
      await delay(500);
      return [...collectors];
  },
  
  getMemberCategories: async (): Promise<MemberCategoryInfo[]> => {
      await delay(200);
      return [...memberCategories];
  },

  getCollectionReport: async (collectorId: number): Promise<CollectionReport> => {
    await delay(700);
    const collector = collectors.find(c => c.id === collectorId);
    if (!collector) throw new Error("Collector not found");
    const membersInZone = members.filter(m => m.collectionZone === collector.zone && m.status === MemberStatus.ACTIVE);
    
    let totalAmount = 0;
    membersInZone.forEach(member => {
        const category = memberCategories.find(c => c.id === member.categoryId);
        if (category) {
            totalAmount += category.fee;
        }
        member.activities.forEach(activityId => {
            const activity = activities.find(a => a.id === activityId);
            if (activity) {
                totalAmount += activity.cost;
            }
        });
    });

    const commission = totalAmount * 0.1; // 10% commission
    const net = totalAmount - commission;

    return {
        collectorId,
        amount: totalAmount,
        commission,
        net,
    };
  }
};
