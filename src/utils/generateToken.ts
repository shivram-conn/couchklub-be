import jwt from 'jsonwebtoken';
import { User } from '@/models/User';

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  hash?: string;
}

export function generateToken(user: User): string {
  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    hash: process.env.JWT_HASH || 'randomhash'
  };

  // Use a secret key from environment variable or default for development
  const secretKey = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  // Generate JWT token with 24 hour expiration
  return jwt.sign(payload, secretKey, { 
    expiresIn: '24h',
    issuer: 'couchklub-api'
  });
}