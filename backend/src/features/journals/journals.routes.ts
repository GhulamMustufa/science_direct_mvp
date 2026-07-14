import { Router } from 'express';
import { JournalsRepository } from './journals.repository.js';
import { JournalsService } from './journals.service.js';
import { JournalsController } from './journals.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

const journalsRepository = new JournalsRepository();
const journalsService = new JournalsService(journalsRepository);
const journalsController = new JournalsController(journalsService);

router.get('/journals', journalsController.getJournals);
router.get('/volumes', journalsController.getAllVolumes);
router.get('/journals/:id', journalsController.getJournalDetail);
router.get('/journals/:id/issues', journalsController.getIssuesForJournal);
router.get('/issues/:id', journalsController.getIssueDetail);

// Admin only routes
router.post('/journals', authenticate, authorize(['admin']), journalsController.createJournal);
router.put('/journals/:id', authenticate, authorize(['admin']), journalsController.updateJournal);

export default router;
