import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.js';

type UserRole = 'reader' | 'author' | 'admin';

export const authorize = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(403, 'Forbidden: You do not have permission to access this resource', 'FORBIDDEN');
    }

    next();
  };
};
