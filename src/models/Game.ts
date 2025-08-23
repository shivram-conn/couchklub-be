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
