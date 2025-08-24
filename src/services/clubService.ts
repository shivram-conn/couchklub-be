import { v4 as uuidv4 } from 'uuid';
import { Club, CreateClubRequest, UpdateClubRequest } from '@/models/Club';
import { db } from '../index';

// In-memory storage for clubs
export const clubs: Map<string, Club> = new Map();

// Club CRUD operations
export const clubService = {
  create: async (data: CreateClubRequest): Promise<Club> => {
    data.memberIds.push(data.ownerId);
    const club: Club = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      ownerId: data.ownerId,
      memberIds: data.memberIds, // Owner is automatically a member
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.query('INSERT INTO clubs (id, name, description, owner_id, member_ids, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)', [
      club.id,
      club.name,
      club.description,
      club.ownerId,
      club.memberIds,
      club.createdAt,
      club.updatedAt,
    ]);
    if (result.rowCount === 0) {
      throw new Error('Failed to create club');
    }
    return club;
  },

  getAll: async (): Promise<Club[]> => {
    const result = await db.query<Club>('SELECT * FROM clubs');
    return result.rows;
  },

  getClubs : async (memberId: string): Promise<Club[]> => {
    const result = await db.query<Club>('SELECT * FROM clubs WHERE member_ids @> $1', [memberId]);
    return result.rows;
  },

  getById: async (id: string): Promise<Club | undefined> => {
    const result = await db.query<Club>('SELECT * FROM clubs WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id: string, data: UpdateClubRequest): Promise<Club | undefined> => {
    const club = clubs.get(id);
    if (!club) return undefined;

    const updatedClub: Club = {
      ...club,
      ...data,
      updatedAt: new Date(),
    };
    await db.query('UPDATE clubs SET name = $2, description = $3, owner_id = $4, member_ids = $5, updated_at = $6 WHERE id = $1', [
      id,
      updatedClub.name,
      updatedClub.description,
      updatedClub.ownerId,
      updatedClub.memberIds,
      updatedClub.updatedAt,
    ]);
    clubs.set(id, updatedClub);
    return updatedClub;
  },

  delete: async (id: string): Promise<boolean> => {
    await db.query('DELETE FROM clubs WHERE id = $1', [id]);
    return true;
  },

  addMember: async (clubId: string, userId: string): Promise<Club | undefined> => {
    const club = clubs.get(clubId);
    if (!club) return undefined;

    if (!club.memberIds.includes(userId)) {
      club.memberIds.push(userId);
      club.updatedAt = new Date();
      clubs.set(clubId, club);
    }
    return club;
  },

  removeMember: async (clubId: string, userId: string): Promise<Club | undefined> => {
    const club = clubs.get(clubId);
    if (!club) return undefined;

    club.memberIds = club.memberIds.filter(id => id !== userId);
    club.updatedAt = new Date();
    clubs.set(clubId, club);
    return club;
  },
};
