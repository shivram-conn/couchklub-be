import { v4 as uuidv4 } from 'uuid';
import { Game, CreateGameRequest, UpdateGameRequest } from '@/models/Game';
import { db } from '../index';

// In-memory storage for games
export const games: Map<string, Game> = new Map();

// Game CRUD operations
export const gameService = {
  create: async (data: CreateGameRequest): Promise<Game> => {
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
    await db.query('INSERT INTO games (id, name, description, club_id, created_by, players, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
      game.id,
      game.name,
      game.description,
      game.clubId,
      game.createdBy,
      game.players,
      game.status,
      game.createdAt,
      game.updatedAt,
    ]);
    games.set(game.id, game);
    return game;
  },

  getAll: async (): Promise<Game[]> => {
    const result = await db.query<Game>('SELECT * FROM games');
    return result.rows;
  },

  getById: async (id: string): Promise<Game | undefined> => {
    const result = await db.query<Game>('SELECT * FROM games WHERE id = $1', [id]);
    return result.rows[0];
  },

  getByClub: async (clubId: string): Promise<Game[]> => {
    const result = await db.query<Game>('SELECT * FROM games WHERE club_id = $1', [clubId]);
    return result.rows;
  },

  update: async (id: string, data: UpdateGameRequest): Promise<Game | undefined> => {
    const game = await games.get(id);
    if (!game) return undefined;

    const updatedGame: Game = {
      ...game,
      ...data,
      updatedAt: new Date(),
    };
    await db.query('UPDATE games SET name = $2, description = $3, club_id = $4, created_by = $5, players = $6, status = $7, updated_at = $8 WHERE id = $1', [
      id,
      updatedGame.name,
      updatedGame.description,
      updatedGame.clubId,
      updatedGame.createdBy,
      updatedGame.players,
      updatedGame.status,
      updatedGame.updatedAt,
    ]);

    return updatedGame;
  },

  delete: async (id: string): Promise<boolean> => {
    await db.query('DELETE FROM games WHERE id = $1', [id]);
    return true;
  },

  addPlayer: async (gameId: string, userId: string): Promise<Game | undefined> => {
    const game = await games.get(gameId);
    if (!game) return undefined;

    if (!game.players.includes(userId)) {
      game.players.push(userId);
      game.updatedAt = new Date();
      games.set(gameId, game);
      await db.query('UPDATE games SET players = $2, updated_at = $3 WHERE id = $1', [
        gameId,
        game.players,
        game.updatedAt,
      ]);
    }
    return game;
  },

  removePlayer: async (gameId: string, userId: string): Promise<Game | undefined> => {
    const game = await games.get(gameId);
    if (!game) return undefined;

    game.players = game.players.filter(id => id !== userId);
    game.updatedAt = new Date();
    games.set(gameId, game);
    await db.query('UPDATE games SET players = $2, updated_at = $3 WHERE id = $1', [
      gameId,
      game.players,
      game.updatedAt,
    ]);
    return game;
  },
};
