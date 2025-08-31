import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

// Zod Schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  createdAt: z.date(),
  updatedAt: z.date(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const UpdateUserRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

// Type inference from Zod schemas
export type UserType = z.infer<typeof UserSchema>;
export type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequestType = z.infer<typeof UpdateUserRequestSchema>;
