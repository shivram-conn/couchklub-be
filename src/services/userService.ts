import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest, UpdateUserRequest } from '@/models/User';
import { db } from '../index';

// In-memory storage for users
export const users: Map<string, User> = new Map();

// User CRUD operations
export const userService = {
  create: async (data: CreateUserRequest): Promise<User> => {
    const user: User = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.query('INSERT INTO users (id, name, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', [
      user.id,
      user.name,
      user.email,
      user.createdAt,
      user.updatedAt,
    ]);
    users.set(user.id, user);
    return user;
  },

  getAll: async (): Promise<User[]> => {
    const result = await db.query<User>('SELECT * FROM users');
    return result.rows;
  },

  getById: async (id: string): Promise<User | undefined> => {
    const result = await db.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id: string, data: UpdateUserRequest): Promise<User | undefined> => {
    const user = await users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    await db.query('UPDATE users SET name = $2, email = $3, updated_at = $4 WHERE id = $1', [
      id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.updatedAt,
    ]);
    users.set(id, updatedUser);
    return updatedUser;
  },

  delete: async (id: string): Promise<boolean> => {
    const user = await users.get(id);
    if (!user) return false;
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    users.delete(id);
    return true;
  },
};
