import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

// In-memory storage for users
export const users: Map<string, User> = new Map();

// User CRUD operations
export const userService = {
  create: (data: CreateUserRequest): User => {
    const user: User = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.set(user.id, user);
    return user;
  },

  getAll: (): User[] => {
    return Array.from(users.values());
  },

  getById: (id: string): User | undefined => {
    return users.get(id);
  },

  update: (id: string, data: UpdateUserRequest): User | undefined => {
    const user = users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    users.set(id, updatedUser);
    return updatedUser;
  },

  delete: (id: string): boolean => {
    return users.delete(id);
  },
};
