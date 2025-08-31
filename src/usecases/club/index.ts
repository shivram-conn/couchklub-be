import { clubService } from '../../services/clubService';
import { userService } from '../../services/userService';
import { CreateClubRequest } from '../../models/Club';
import { TokenPayload } from '@/lib/verifyToken';

export class ClubUsecases {
  static async getAllClubs(currentUser: TokenPayload) {
    try {
      const clubs = await clubService.getClubs(currentUser.id);
      return {
        success: true,
        data: clubs
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

  static async createClub(requestBody: CreateClubRequest, currentUser: TokenPayload) {
    try {
      const body = { ...requestBody };
      body.ownerId = currentUser.id;
      
      if (!body.name || !body.description || !body.memberIds) {
        return {
          success: false,
          error: {
            error: 'Name, description, and ownerId are required'
          },
          statusCode: 400
        };
      }
      
      // Check if owner exists
      const owner = await userService.getById(body.ownerId);
      if (!owner) {
        return {
          success: false,
          error: {
            error: 'Owner user not found'
          },
          statusCode: 400
        };
      }
      
      const club = await clubService.create(body);
      return {
        success: true,
        data: club,
        statusCode: 201
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
