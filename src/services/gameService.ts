import { v4 as uuidv4 } from 'uuid';
import { Game, CreateGameRequest, UpdateGameRequest } from '../models/Game';

// In-memory storage for games
export const games: Map<string, Game> = new Map();

// Game CRUD operations
export const gameService = {
  create: (data: CreateGameRequest): Game => {
    const game: Game = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      clubId: data.clubId,
      createdBy: data.createdBy,
      players: [data.createdBy], // Creator is automatically a player
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    games.set(game.id, game);
    return game;
  },

  getAll: (): Game[] => {
    return Array.from(games.values());
  },

  getById: (id: string): Game | undefined => {
    return games.get(id);
  },

  getByClub: (clubId: string): Game[] => {
    return Array.from(games.values()).filter(game => game.clubId === clubId);
  },

  update: (id: string, data: UpdateGameRequest): Game | undefined => {
    const game = games.get(id);
    if (!game) return undefined;

    const updatedGame: Game = {
      ...game,
      ...data,
      updatedAt: new Date(),
    };
    games.set(id, updatedGame);
    return updatedGame;
  },

  delete: (id: string): boolean => {
    return games.delete(id);
  },

  addPlayer: (gameId: string, userId: string): Game | undefined => {
    const game = games.get(gameId);
    if (!game) return undefined;

    if (!game.players.includes(userId)) {
      game.players.push(userId);
      game.updatedAt = new Date();
      games.set(gameId, game);
    }
    return game;
  },

  removePlayer: (gameId: string, userId: string): Game | undefined => {
    const game = games.get(gameId);
    if (!game) return undefined;

    game.players = game.players.filter(id => id !== userId);
    game.updatedAt = new Date();
    games.set(gameId, game);
    return game;
  },
};
