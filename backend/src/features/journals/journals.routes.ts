import { Router } from 'express';
import { JournalsRepository } from './journals.repository.js';
import { JournalsService } from './journals.service.js';
import { JournalsController } from './journals.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import multer from 'multer';
import path from 'path';

// Reusing local storage for multer before pushing to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

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
router.post('/journals', authenticate, authorize(['admin']), upload.single('coverImage'), journalsController.createJournal);
router.put('/journals/:id', authenticate, authorize(['admin']), upload.single('coverImage'), journalsController.updateJournal);

export default router;
