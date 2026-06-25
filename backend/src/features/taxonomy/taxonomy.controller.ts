import { Request, Response, NextFunction } from 'express';
import { TaxonomyService } from './taxonomy.service.js';

export class TaxonomyController {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Handle fetching all active categories.
   */
  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.taxonomyService.getCategories();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle fetching all active keywords.
   */
  getKeywords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.taxonomyService.getKeywords();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
