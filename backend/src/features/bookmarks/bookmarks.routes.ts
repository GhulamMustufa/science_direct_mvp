import { Router } from 'express';
import { BookmarksRepository } from './bookmarks.repository.js';
import { BookmarksService } from './bookmarks.service.js';
import { BookmarksController } from './bookmarks.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

const bookmarksRepository = new BookmarksRepository();
const bookmarksService = new BookmarksService(bookmarksRepository);
const bookmarksController = new BookmarksController(bookmarksService);

router.get('/bookmarks', authenticate, bookmarksController.getBookmarks);
router.post('/bookmarks', authenticate, bookmarksController.addBookmark);
router.delete('/bookmarks/:articleId', authenticate, bookmarksController.removeBookmark);

export default router;
