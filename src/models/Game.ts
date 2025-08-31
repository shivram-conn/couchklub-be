import { z } from 'zod';

export interface Game {
  id: string;
  name: string;
  description: string;
  clubId: string;
  createdBy: string;
  players: string[];
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameRequest {
  name: string;
  description: string;
  clubId: string;
  createdBy: string;
}

export interface UpdateGameRequest {
  name?: string;
  description?: string;
  status?: 'pending' | 'active' | 'completed';
}

// Zod Schemas
const GameStatusEnum = z.enum(['pending', 'active', 'completed']);

export const GameSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Game name is required").max(100, "Game name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  clubId: z.string().uuid("Invalid club ID format"),
  createdBy: z.string().uuid("Invalid creator ID format"),
  players: z.array(z.string().uuid("Invalid player ID format")),
  status: GameStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateGameRequestSchema = z.object({
  name: z.string().min(1, "Game name is required").max(100, "Game name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  clubId: z.string().uuid("Invalid club ID format"),
  createdBy: z.string().uuid("Invalid creator ID format"),
});

export const UpdateGameRequestSchema = z.object({
  name: z.string().min(1, "Game name is required").max(100, "Game name must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
  status: GameStatusEnum.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

// Type inference from Zod schemas
export type GameType = z.infer<typeof GameSchema>;
export type CreateGameRequestType = z.infer<typeof CreateGameRequestSchema>;
export type UpdateGameRequestType = z.infer<typeof UpdateGameRequestSchema>;
