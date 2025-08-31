import { z } from 'zod';

export interface LiveUser {
    id: string;
    name: string;
    email: string;
    token: string;
    loginAt: Date;
    metadata: any;
}

export interface LoginUser {
    email: string;
    password: string;
}

export interface LogoutUser {
    id: string;
}

// Zod Schemas
export const LiveUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().email("Invalid email format"),
    token: z.string().min(1, "Token is required"),
    loginAt: z.date(),
    metadata: z.any().optional(),
});

export const LoginUserSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LogoutUserSchema = z.object({
    id: z.string().uuid("Invalid user ID format"),
});

// Type inference from Zod schemas
export type LiveUserType = z.infer<typeof LiveUserSchema>;
export type LoginUserType = z.infer<typeof LoginUserSchema>;
export type LogoutUserType = z.infer<typeof LogoutUserSchema>;