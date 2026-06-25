import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.js';

export interface UserPayload {
  id: string;
  email: string;
  role: 'reader' | 'author' | 'editor' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new AppError(401, 'Authentication token is missing', 'UNAUTHORIZED');
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET;
  if (!accessSecret) {
    throw new AppError(500, 'JWT access secret is not configured', 'CONFIG_ERROR');
  }

  try {
    const decoded = jwt.verify(token, accessSecret) as jwt.JwtPayload & {
      sub: string;
      email: string;
      role: 'reader' | 'author' | 'editor' | 'admin';
    };

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new AppError(401, 'Authentication token is invalid or expired', 'UNAUTHORIZED');
  }
};
