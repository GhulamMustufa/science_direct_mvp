import { Router } from 'express';
import { ReadingListsRepository } from './reading-lists.repository.js';
import { ReadingListsService } from './reading-lists.service.js';
import { ReadingListsController } from './reading-lists.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const readingListsRepository = new ReadingListsRepository();
const readingListsService = new ReadingListsService(readingListsRepository);
const readingListsController = new ReadingListsController(readingListsService);

router.get('/reading-lists', authenticate, readingListsController.getReadingLists);
router.post('/reading-lists', authenticate, readingListsController.createReadingList);
router.get('/reading-lists/:id', authenticate, readingListsController.getReadingListDetail);
router.put('/reading-lists/:id', authenticate, readingListsController.updateReadingList);
router.delete('/reading-lists/:id', authenticate, readingListsController.deleteReadingList);
router.post('/reading-lists/:id/articles', authenticate, readingListsController.addArticle);
router.delete(
  '/reading-lists/:id/articles/:articleId',
  authenticate,
  readingListsController.removeArticle
);

export default router;
