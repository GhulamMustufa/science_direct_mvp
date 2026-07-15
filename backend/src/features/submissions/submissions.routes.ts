import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import multer from 'multer';
import { submitArticle, getMySubmissions, uploadRevision, validateArticle, validateRevision } from './submissions.controller.js';
import path from 'path';
import os from 'os';

const router = Router();

// Configure Multer for PDF uploads only
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // In a real app, ensure this directory exists
    cb(null, os.tmpdir());
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
      'application/msword',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type uploaded'));
    }
  }
});

const uploadFields = upload.fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

router.post('/submissions', authenticate, uploadFields, submitArticle);
router.post('/submissions/validate', authenticate, uploadFields, validateArticle);
router.get('/submissions', authenticate, getMySubmissions);
router.post('/submissions/:id/revisions', authenticate, uploadFields, uploadRevision);
router.post('/submissions/:id/revisions/validate', authenticate, uploadFields, validateRevision);

export default router;
