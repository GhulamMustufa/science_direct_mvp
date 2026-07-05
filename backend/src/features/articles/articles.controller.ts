import { Request, Response, NextFunction } from 'express';
import { ArticlesService } from './articles.service.js';

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

export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  /**
   * Search for articles with full-text search, filters, and pagination.
   */
  getArticles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit, offset } = parsePagination(req.query);
      const query = typeof req.query.query === 'string' ? req.query.query : undefined;
      const journalId = typeof req.query.journalId === 'string' ? req.query.journalId : undefined;
      const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
      const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

      const { articles: list, total } = await this.articlesService.searchArticles({
        query,
        journalId,
        categoryId,
        keyword,
        limit,
        offset,
      });

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
   * Get full details of an article.
   */
  getArticleDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.articlesService.getArticleDetail(id);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Track an abstract view and atomically increment views count.
   */
  trackView = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.articlesService.trackView(id);

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Track a PDF download download event, incrementing downloads count and redirecting to PDF location.
   */
  trackDownload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const pdfUrl = await this.articlesService.trackDownload(id);

      res.redirect(pdfUrl);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Proxy the PDF to bypass OJS X-Frame-Options and force inline display in the iframe.
   */
  streamPdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const article = await this.articlesService.getArticleDetail(id);
      
      if (!article || !article.pdfUrl) {
         res.status(404).send('PDF not found');
         return;
      }
      
      let downloadUrl = article.pdfUrl;
      // Convert OJS view URL to download URL to get raw file stream instead of the OJS HTML wrapper
      if (downloadUrl.includes('/article/view/')) {
        downloadUrl = downloadUrl.replace('/article/view/', '/article/download/');
      }

      const pdfRes = await fetch(downloadUrl);
      if (!pdfRes.ok) throw new Error('Failed to fetch PDF from OJS');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="article.pdf"'); // Force inline display
      
      const arrayBuffer = await pdfRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } catch (error) {
      next(error);
    }
  };
}
