import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  hash?: string;
}

/**
 * Verify JWT token and return user information
 */
export function verifyToken(token: string): TokenPayload | undefined {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Use the same secret key as generateToken
    const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    // Verify and decode the JWT token
    const decoded = jwt.verify(cleanToken, secretKey) as TokenPayload;
    
    if (decoded.hash !== process.env.JWT_HASH){
        return undefined;
    }
    
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      hash: decoded.hash
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return undefined;
  }
}
