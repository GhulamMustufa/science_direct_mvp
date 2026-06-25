import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { changeRoleSchema, userIdParamSchema } from './admin.schema.js';
import { AppError } from '../../middleware/error.js';

/**
 * Helper to safely extract and sanitize limit and offset pagination parameters.
 */
const parsePagination = (query: Request['query']): { limit: number; offset: number } => {
  const defaultLimit = 10;
  const maxLimit = 100;
  const defaultOffset = 0;

  const rawLimit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : NaN;
  const limit = isNaN(rawLimit) || rawLimit <= 0 ? defaultLimit : Math.min(rawLimit, maxLimit);

  const rawOffset = typeof query.offset === 'string' ? parseInt(query.offset, 10) : NaN;
  const offset = isNaN(rawOffset) || rawOffset < 0 ? defaultOffset : rawOffset;

  return { limit, offset };
};

export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * Fetch paginated list of active users.
   */
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { limit, offset } = parsePagination(req.query);
      const { users, total } = await this.adminService.getUsers(limit, offset);

      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          total,
          limit,
          offset,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a user's role.
   */
  changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id } = userIdParamSchema.parse(req.params);
      const { role } = changeRoleSchema.parse(req.body);

      const updated = await this.adminService.changeUserRole(id, role);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}
