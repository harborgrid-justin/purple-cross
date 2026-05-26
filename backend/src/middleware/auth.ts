import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './error-handler';
import { HTTP_STATUS } from '../constants';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  staffId?: string;
}

// Make the authenticated principal available on every request in a type-safe
// way (mirrors the `correlationId` augmentation in correlation-id.ts).
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

// Backwards-compatible alias: callers can keep using `AuthRequest`.
export type AuthRequest = Request;

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', HTTP_STATUS.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      staffId: decoded.staffId,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', HTTP_STATUS.UNAUTHORIZED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', HTTP_STATUS.UNAUTHORIZED);
    }
    throw error;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError('Forbidden: Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
    next();
  };
};
