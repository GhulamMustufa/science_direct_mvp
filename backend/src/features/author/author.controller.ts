import { Request, Response, NextFunction } from 'express';
import { AuthorService } from './author.service.js';
import { AppError } from '../../middleware/error.js';

export class AuthorController {
  constructor(private authorService: AuthorService) {}

  /**
   * Fetch author analytics and publications list.
   */
  getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const data = await this.authorService.getAuthorDashboard(req.user.id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
