import { z } from 'zod';

export interface GameResource {
    id: string;
    name: string;
    description: string;
    type: string;
    clubId: string;
    ownerId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateGameResourceRequest {
    name: string;
    description: string;
    type: string;
    clubId: string;
    ownerId: string;
    createdBy: string;
}

export interface UpdateGameResourceRequest {
    name?: string;
    description?: string;
    type?: string;
    ownerId?: string;
}

// Zod Schemas
export const GameResourceSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "Resource name is required").max(100, "Resource name must be less than 100 characters"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
    type: z.string().min(1, "Resource type is required").max(50, "Resource type must be less than 50 characters"),
    clubId: z.string().uuid("Invalid club ID format"),
    ownerId: z.string().uuid("Invalid owner ID format"),
    createdBy: z.string().uuid("Invalid creator ID format"),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const CreateGameResourceRequestSchema = z.object({
    name: z.string().min(1, "Resource name is required").max(100, "Resource name must be less than 100 characters"),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
    type: z.string().min(1, "Resource type is required").max(50, "Resource type must be less than 50 characters"),
    clubId: z.string().uuid("Invalid club ID format"),
    ownerId: z.string().uuid("Invalid owner ID format"),
    createdBy: z.string().uuid("Invalid creator ID format"),
});

export const UpdateGameResourceRequestSchema = z.object({
    name: z.string().min(1, "Resource name is required").max(100, "Resource name must be less than 100 characters").optional(),
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
    type: z.string().min(1, "Resource type is required").max(50, "Resource type must be less than 50 characters").optional(),
    ownerId: z.string().uuid("Invalid owner ID format").optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});

// Type inference from Zod schemas
export type GameResourceType = z.infer<typeof GameResourceSchema>;
export type CreateGameResourceRequestType = z.infer<typeof CreateGameResourceRequestSchema>;
export type UpdateGameResourceRequestType = z.infer<typeof UpdateGameResourceRequestSchema>;