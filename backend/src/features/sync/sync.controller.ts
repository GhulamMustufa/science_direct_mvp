import { Request, Response, NextFunction } from 'express';
import { SyncService } from './sync.service.js';
import { AppError } from '../../middleware/error.js';
import { z } from 'zod';

const syncJobParamSchema = z.object({
  jobId: z.string().uuid({ message: 'Invalid job ID format (must be a UUID)' }),
});

export class SyncController {
  constructor(private syncService: SyncService) {}

  /**
   * Manually trigger background sync pull from OJS.
   */
  triggerSync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const jobId = this.syncService.triggerSync();

      res.status(202).json({
        success: true,
        data: {
          jobId,
          status: 'pending',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Check status of a background sync job.
   */
  getJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { jobId } = syncJobParamSchema.parse(req.params);
      const job = this.syncService.getJobStatus(jobId);

      if (!job) {
        throw new AppError(404, 'Sync job not found', 'JOB_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: job,
      });
    } catch (error) {
      next(error);
    }
  };
}
