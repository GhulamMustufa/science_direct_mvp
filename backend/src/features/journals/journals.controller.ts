import { Request, Response, NextFunction } from 'express';
import { JournalsService } from './journals.service.js';

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

export class JournalsController {
  constructor(private journalsService: JournalsService) {}

  /**
   * Handle fetching list of journals.
   */
  getJournals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit, offset } = parsePagination(req.query);
      const { journals: list, total } = await this.journalsService.getJournals(limit, offset);

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
   * Handle fetching all volumes across all journals.
   */
  getAllVolumes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.journalsService.getAllVolumes();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle fetching detail of a journal.
   */
  getJournalDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.journalsService.getJournalDetail(id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle fetching issues within a journal.
   */
  getIssuesForJournal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { limit, offset } = parsePagination(req.query);
      const { issues: list, total } = await this.journalsService.getIssuesForJournal(id, limit, offset);

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
   * Handle fetching detail of an issue including table of contents.
   */
  getIssueDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.journalsService.getIssueDetail(id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle creating a new journal (Admin only).
   */
  createJournal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, description, issn, ojsJournalId } = req.body;
      const data = await this.journalsService.createJournal({ title, description, issn, ojsJournalId });

      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle updating an existing journal (Admin only).
   */
  updateJournal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, issn } = req.body;
      const data = await this.journalsService.updateJournal(id, { title, description, issn });

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
