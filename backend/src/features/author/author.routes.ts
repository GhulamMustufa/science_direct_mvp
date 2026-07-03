import { Router } from 'express';
import { AuthorRepository } from './author.repository.js';
import { AuthorService } from './author.service.js';
import { AuthorController } from './author.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

const authorRepository = new AuthorRepository();
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);

router.get(
  '/author/dashboard',
  authenticate,
  authorize(['author', 'admin']),
  authorController.getDashboard
);

export default router;
