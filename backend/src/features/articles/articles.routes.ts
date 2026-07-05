import { Router } from 'express';
import { ArticlesRepository } from './articles.repository.js';
import { ArticlesService } from './articles.service.js';
import { ArticlesController } from './articles.controller.js';

const router = Router();

const articlesRepository = new ArticlesRepository();
const articlesService = new ArticlesService(articlesRepository);
const articlesController = new ArticlesController(articlesService);

router.get('/articles', articlesController.getArticles);
router.get('/articles/:id', articlesController.getArticleDetail);
router.get('/articles/:id/download', articlesController.trackDownload);
router.post('/articles/:id/view', articlesController.trackView);
router.get('/articles/:id/pdf', articlesController.streamPdf);

export default router;
