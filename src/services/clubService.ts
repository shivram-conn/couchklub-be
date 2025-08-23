import { v4 as uuidv4 } from 'uuid';
import { Club, CreateClubRequest, UpdateClubRequest } from '../models/Club';

// In-memory storage for clubs
export const clubs: Map<string, Club> = new Map();

// Club CRUD operations
export const clubService = {
  create: (data: CreateClubRequest): Club => {
    const club: Club = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      memberIds: [data.ownerId], // Owner is automatically a member
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    clubs.set(club.id, club);
    return club;
  },

  getAll: (): Club[] => {
    return Array.from(clubs.values());
  },

  getById: (id: string): Club | undefined => {
    return clubs.get(id);
  },

  update: (id: string, data: UpdateClubRequest): Club | undefined => {
    const club = clubs.get(id);
    if (!club) return undefined;

    const updatedClub: Club = {
      ...club,
      ...data,
      updatedAt: new Date(),
    };
    clubs.set(id, updatedClub);
    return updatedClub;
  },

  delete: (id: string): boolean => {
    return clubs.delete(id);
  },

  addMember: (clubId: string, userId: string): Club | undefined => {
    const club = clubs.get(clubId);
    if (!club) return undefined;

    if (!club.memberIds.includes(userId)) {
      club.memberIds.push(userId);
      club.updatedAt = new Date();
      clubs.set(clubId, club);
    }
    return club;
  },

  removeMember: (clubId: string, userId: string): Club | undefined => {
    const club = clubs.get(clubId);
    if (!club) return undefined;

    club.memberIds = club.memberIds.filter(id => id !== userId);
    club.updatedAt = new Date();
    clubs.set(clubId, club);
    return club;
  },
};
