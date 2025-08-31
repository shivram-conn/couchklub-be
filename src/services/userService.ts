import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UserSchema
} from '../models/User';
import { db } from '../index';
import { validateData, ValidationResult } from '../lib/validation';

// In-memory storage for users
export const users: Map<string, User> = new Map();

// User CRUD operations with Zod validation
export const userService = {
  create: async (data: CreateUserRequest): Promise<{ success: boolean; user?: User; errors?: string[] }> => {
    // Validate input data
    const validation = validateData(CreateUserRequestSchema, data);
    if (!validation.success) {
      return { success: false, errors: validation.errors };
    }

    const user: User = {
      id: uuidv4(),
      name: validation.data!.name,
      email: validation.data!.email,
      password: validation.data!.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate the created user object
    const userValidation = validateData(UserSchema, user);
    if (!userValidation.success) {
      return { success: false, errors: userValidation.errors };
    }

    try {
      await db.query('INSERT INTO users (id, name, email, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)', [
        user.id,
        user.name,
        user.email,
        user.createdAt,
        user.updatedAt,
      ]);
      users.set(user.id, user);
      return { success: true, user };
    } catch (error) {
      return { success: false, errors: ['Database error occurred'] };
    }
  },

  getAll: async (): Promise<User[]> => {
    const result = await db.query<User>('SELECT * FROM users');
    return result.rows;
  },

  getById: async (id: string): Promise<User | undefined> => {
    const result = await db.query<User>('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  update: async (id: string, data: UpdateUserRequest): Promise<{ success: boolean; user?: User; errors?: string[] }> => {
    // Validate input data
    const validation = validateData(UpdateUserRequestSchema, data);
    if (!validation.success) {
      return { success: false, errors: validation.errors };
    }

    const user = await users.get(id);
    if (!user) {
      return { success: false, errors: ['User not found'] };
    }

    const updatedUser: User = {
      ...user,
      ...validation.data!,
      updatedAt: new Date(),
    };

    // Validate the updated user object
    const userValidation = validateData(UserSchema, updatedUser);
    if (!userValidation.success) {
      return { success: false, errors: userValidation.errors };
    }

    try {
      await db.query('UPDATE users SET name = $2, email = $3, updated_at = $4 WHERE id = $1', [
        id,
        updatedUser.name,
        updatedUser.email,
        updatedUser.updatedAt,
      ]);
      users.set(id, updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, errors: ['Database error occurred'] };
    }
  },

  delete: async (id: string): Promise<boolean> => {
    const user = await users.get(id);
    if (!user) return false;
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    users.delete(id);
    return true;
  },

  getByEmail: async (email: string): Promise<User | undefined> => {
    const result = await db.query<User>('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return undefined;
    }
    return result.rows[0];
  },
};
