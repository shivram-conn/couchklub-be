import { userService } from '../../services/userService';
import { generateToken } from '@/lib/generateToken';

export class SigninUsecases {
  static async signin(requestBody: { email: string; password: string }) {
    try {
      const { email, password } = requestBody;
      
      if (!email || !password) {
        return {
          success: false,
          error: {
            error: 'Email and password are required'
          },
          statusCode: 400
        };
      }

      const user = await userService.getByEmail(email);
      if (!user || user.password !== password) {
        return {
          success: false,
          error: {
            error: 'Invalid credentials'
          },
          statusCode: 401
        };
      }

      const token = generateToken(user);
      return {
        success: true,
        data: {
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
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
