import { Request, Response, NextFunction } from 'express';
import { ReadingListsService } from './reading-lists.service.js';
import {
  createListSchema,
  updateListSchema,
  addArticleSchema,
} from './reading-lists.schema.js';
import { AppError } from '../../middleware/error.js';

export class ReadingListsController {
  constructor(private readingListsService: ReadingListsService) {}

  /**
   * Fetch all reading lists belonging to the logged-in user.
   */
  getReadingLists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const lists = await this.readingListsService.getReadingLists(req.user.id);

      res.status(200).json({
        success: true,
        data: lists,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Fetch details of a reading list including its articles.
   */
  getReadingListDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const detail = await this.readingListsService.getReadingListDetail(req.user.id, id);

      res.status(200).json({
        success: true,
        data: detail,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new reading list.
   */
  createReadingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const input = createListSchema.parse(req.body);
      const newList = await this.readingListsService.createReadingList(req.user.id, input);

      res.status(201).json({
        success: true,
        data: newList,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update name/description of a reading list.
   */
  updateReadingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id } = req.params;
      const input = updateListSchema.parse(req.body);
      const updated = await this.readingListsService.updateReadingList(req.user.id, id, input);

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Soft-delete a reading list.
   */
  deleteReadingList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id } = req.params;
      await this.readingListsService.deleteReadingList(req.user.id, id);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add an article to a reading list.
   */
  addArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id: readingListId } = req.params;
      const { articleId } = addArticleSchema.parse(req.body);
      await this.readingListsService.addArticle(req.user.id, readingListId, articleId);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove an article from a reading list.
   */
  removeArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { id: readingListId, articleId } = req.params;
      await this.readingListsService.removeArticle(req.user.id, readingListId, articleId);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
