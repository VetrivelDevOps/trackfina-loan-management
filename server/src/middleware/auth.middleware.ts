import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

// Define the extended request type
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    role?: string; // Add role if you need it
  }
}

// Middleware to validate JWT tokens
export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Unauthorized: Missing or invalid token format', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AppError('Unauthorized: Missing token', 401);
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string, role?: string };
    
    // Add user info to the request
    (req as AuthenticatedRequest).user = { 
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Unauthorized: Invalid token', 401));
    } else {
      next(error);
    }
  }
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      
      if (!authReq.user || !authReq.user.role || !roles.includes(authReq.user.role)) {
        throw new AppError('Forbidden: Insufficient permissions', 403);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};