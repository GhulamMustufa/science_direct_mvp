import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import multer from 'multer';
import { submitArticle, getMySubmissions, uploadRevision } from './submissions.controller.js';
import path from 'path';

const router = Router();

// Configure Multer for PDF uploads only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In a real app, ensure this directory exists
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word Document (.docx, .doc) files are allowed'));
    }
  }
});

router.post('/submissions', authenticate, upload.single('pdf'), submitArticle);
router.get('/submissions', authenticate, getMySubmissions);
router.post('/submissions/:id/revisions', authenticate, upload.single('pdf'), uploadRevision);

export default router;
