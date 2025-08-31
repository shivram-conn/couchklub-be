import { z } from 'zod';

export interface Club {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClubRequest {
  name: string;
  description: string;
  memberIds: string[];
  ownerId: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
}

// Zod Schemas
export const ClubSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Club name is required").max(100, "Club name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  ownerId: z.string().uuid("Invalid owner ID format"),
  memberIds: z.array(z.string().uuid("Invalid member ID format")),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateClubRequestSchema = z.object({
  name: z.string().min(1, "Club name is required").max(100, "Club name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  memberIds: z.array(z.string().uuid("Invalid member ID format")).default([]),
  ownerId: z.string().uuid("Invalid owner ID format"),
});

export const UpdateClubRequestSchema = z.object({
  name: z.string().min(1, "Club name is required").max(100, "Club name must be less than 100 characters").optional(),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters").optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update",
});

// Type inference from Zod schemas
export type ClubType = z.infer<typeof ClubSchema>;
export type CreateClubRequestType = z.infer<typeof CreateClubRequestSchema>;
export type UpdateClubRequestType = z.infer<typeof UpdateClubRequestSchema>;
