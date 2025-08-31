import { gameService } from '../../services/gameService';
import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { CreateGameRequest } from '../../models/Game';

export class GameUsecases {
  static async getAllGames(clubId?: string) {
    try {
      const games = clubId ? gameService.getByClub(clubId) : gameService.getAll();
      return {
        success: true,
        data: games
      };
    } catch (error) {
      return {
        success: false,
        error: {
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
        }
      };
    }
  }

  static async createGame(requestBody: CreateGameRequest) {
    try {
      if (!requestBody.name || !requestBody.description || !requestBody.clubId || !requestBody.createdBy) {
        return {
          success: false,
          error: {
            error: 'Name, description, clubId, and createdBy are required'
          },
          statusCode: 400
        };
      }

      // Check if club and creator exist
      const club = clubService.getById(requestBody.clubId);
      const creator = userService.getById(requestBody.createdBy);
      
      if (!club) {
        return {
          success: false,
          error: {
            error: 'Club not found'
          },
          statusCode: 400
        };
      }
      
      if (!creator) {
        return {
          success: false,
          error: {
            error: 'Creator user not found'
          },
          statusCode: 400
        };
      }

      const game = gameService.create(requestBody);
      return {
        success: true,
        data: game
      };
    } catch (error) {
      return {
        success: false,
        error: {
          error: 'Internal server error',
          timestamp: new Date().toISOString(),
        }
      };
    }
  }
}
