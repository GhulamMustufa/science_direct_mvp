import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { getSubmissions, makeDecision, publishArticle } from './editorial.controller.js';

const router = Router();

// Only ADMIN should access these routes for now.
router.get('/editorial/submissions', authenticate, authorize(['admin']), getSubmissions);
router.post('/editorial/submissions/:id/decision', authenticate, authorize(['admin']), makeDecision);
router.post('/editorial/submissions/:id/publish', authenticate, authorize(['admin']), publishArticle);

export default router;
