import { userService } from '../../services/userService';
import { CreateUserRequestSchema, UpdateUserRequestSchema } from '../../models/User';
import { validateData, createValidationErrorResponse } from '../../lib/validation';

export class UserUsecases {
  static async getAllUsers() {
    try {
      const users = await userService.getAll();
      return {
        success: true,
        data: {
          message: 'Users retrieved successfully',
          users,
          count: users.length,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  static async createUser(requestBody: unknown) {
    try {
      // Validate request body using Zod schema
      const validation = validateData(CreateUserRequestSchema, requestBody);
      
      if (!validation.success) {
        return {
          success: false,
          error: createValidationErrorResponse(validation.errors!),
        };
      }

      // Call service with validated data
      const result = await userService.create(validation.data!);
      
      if (!result.success) {
        return {
          success: false,
          error: {
            error: 'Failed to create user',
            details: result.errors,
            timestamp: new Date().toISOString(),
          }
        };
      }

      return {
        success: true,
        data: {
          message: 'User created successfully',
          user: result.user,
        }
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

  static async getUserById(id: string) {
    try {
      const user = await userService.getById(id);
      
      if (!user) {
        return {
          success: false,
          error: {
            error: 'User not found',
            timestamp: new Date().toISOString(),
          },
          statusCode: 404
        };
      }

      return {
        success: true,
        data: {
          message: 'User retrieved successfully',
          user,
        }
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

  static async updateUser(id: string, requestBody: unknown) {
    try {
      // Validate request body using Zod schema
      const validation = validateData(UpdateUserRequestSchema, requestBody);
      
      if (!validation.success) {
        return {
          success: false,
          error: createValidationErrorResponse(validation.errors!),
        };
      }

      // Call service with validated data
      const result = await userService.update(id, validation.data!);
      
      if (!result.success) {
        if (result.errors?.includes('User not found')) {
          return {
            success: false,
            error: {
              error: 'User not found',
              timestamp: new Date().toISOString(),
            },
            statusCode: 404
          };
        }
        
        return {
          success: false,
          error: {
            error: 'Failed to update user',
            details: result.errors,
            timestamp: new Date().toISOString(),
          }
        };
      }

      return {
        success: true,
        data: {
          message: 'User updated successfully',
          user: result.user,
        }
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

  static async deleteUser(id: string) {
    try {
      const deleted = await userService.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: {
            error: 'User not found',
            timestamp: new Date().toISOString(),
          },
          statusCode: 404
        };
      }
      
      return {
        success: true,
        data: {
          message: 'User deleted successfully',
          timestamp: new Date().toISOString(),
        }
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
