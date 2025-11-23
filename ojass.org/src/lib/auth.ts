import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Verify JWT token and return user ID
 */
export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Verify admin JWT token and return decoded payload
 * Throws error if token is invalid or not an admin
 */
export function verifyAdminToken(token: string): { email: string; role: string } {
  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("Server configuration error: JWT_SECRET not set");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    
    if (decoded?.role !== 'admin') {
      throw new Error("Only admins can access this route!");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    throw error;
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  success: boolean;
  userId?: string;
  user?: any;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Authentication required' };
    }

    const token = authHeader.slice(7).trim();
    const decoded = await verifyToken(token);

    if (!decoded) {
      return { success: false, error: 'Invalid or expired token' };
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, userId: decoded.userId, user };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
}

/**
 * Verify user is authenticated and has paid
 */
export async function requireAuthAndPayment(request: NextRequest): Promise<{
  success: boolean;
  userId?: string;
  user?: any;
  error?: string;
}> {
  const authResult = await getAuthenticatedUser(request);
  
  if (!authResult.success) {
    return authResult;
  }

  if (!authResult.user?.isEmailVerified) {
    return { success: false, error: 'Email verification required' };
  }

  if (!authResult.user?.isPaid) {
    return { success: false, error: 'Payment required to register for events' };
  }

  return authResult;
}
