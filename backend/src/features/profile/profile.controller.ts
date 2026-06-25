import { Request, Response, NextFunction } from 'express';
import { ProfileService } from './profile.service.js';
import { updateProfileSchema } from './profile.schema.js';
import { AppError } from '../../middleware/error.js';

export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * Fetch currently logged-in user profile.
   */
  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const profile = await this.profileService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update core/author profile details.
   */
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const input = updateProfileSchema.parse(req.body);
      const updated = await this.profileService.updateProfile(req.user.id, input);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}
