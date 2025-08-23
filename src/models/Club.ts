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
  ownerId: string;
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
}
