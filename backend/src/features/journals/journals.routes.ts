import { Router } from 'express';
import { JournalsRepository } from './journals.repository.js';
import { JournalsService } from './journals.service.js';
import { JournalsController } from './journals.controller.js';

const router = Router();

const journalsRepository = new JournalsRepository();
const journalsService = new JournalsService(journalsRepository);
const journalsController = new JournalsController(journalsService);

router.get('/journals', journalsController.getJournals);
router.get('/journals/:id', journalsController.getJournalDetail);
router.get('/journals/:id/issues', journalsController.getIssuesForJournal);
router.get('/issues/:id', journalsController.getIssueDetail);

export default router;
