import { Request, Response, NextFunction } from 'express';
import { BookmarksService } from './bookmarks.service.js';
import { bookmarkInputSchema } from './bookmarks.schema.js';
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

export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {}

  /**
   * Fetch paginated list of bookmarks for the logged-in user.
   */
  getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { limit, offset } = parsePagination(req.query);
      const { bookmarks: list, total } = await this.bookmarksService.getBookmarks(
        req.user.id,
        limit,
        offset
      );

      res.status(200).json({
        success: true,
        data: list,
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
   * Bookmark an article for the logged-in user.
   */
  addBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { articleId } = bookmarkInputSchema.parse(req.body);
      const bookmark = await this.bookmarksService.addBookmark(req.user.id, articleId);

      res.status(201).json({
        success: true,
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove a bookmarked article for the logged-in user.
   */
  removeBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
      }

      const { articleId } = req.params;
      await this.bookmarksService.removeBookmark(req.user.id, articleId);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
