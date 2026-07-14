import { Request, Response } from 'express';
import { z } from 'zod';
import { submissionsService } from './submissions.service.js';

import { validationService } from './validation/ValidationService.js';

import { documentParserService } from './parser/DocumentParserService.js';

export const submitArticle = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id; // Assuming auth middleware sets req.user
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    let parsedDocument;
    if (req.file) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(req.file.path);
        parsedDocument = await documentParserService.parseDocument(buffer, req.file.mimetype, req.file.originalname);
      } catch (err) {
        console.error('Document parsing error:', err);
      }
    }

    const payload = {
      title: req.body.title,
      abstract: req.body.abstract,
      section: req.body.section,
      language: req.body.language,
      authors: req.body.authors ? JSON.parse(req.body.authors) : undefined,
      keywords: req.body.keywords ? JSON.parse(req.body.keywords) : undefined,
      file: req.file ? { mimetype: req.file.mimetype, size: req.file.size } : undefined,
      parsedDocument
    };

    const validationResult = validationService.validateSubmission(payload);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: 'Validation error', details: validationResult.errors });
    }

    const article = await submissionsService.submitArticle(submitterId, req.body, req.file!);
    res.status(201).json(article);
  } catch (error) {
    console.error('Error submitting article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMySubmissions = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id;
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const submissions = await submissionsService.getMySubmissions(submitterId);
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadRevision = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id;
    const articleId = req.params.id;
    
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = {
      file: req.file ? { mimetype: req.file.mimetype, size: req.file.size } : undefined
    };

    const validationResult = validationService.validateRevision(payload);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: 'Validation error', details: validationResult.errors });
    }

    const updatedArticle = await submissionsService.uploadRevision(submitterId, articleId, req.file!);
    res.json(updatedArticle);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return res.status(403).json({ error: error.message });
    if (error.message === 'Article not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Revisions are not currently required for this article') return res.status(400).json({ error: error.message });
    
    console.error('Error uploading revision:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateArticle = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id;
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let parsedDocument;
    if (req.file) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(req.file.path);
        parsedDocument = await documentParserService.parseDocument(buffer, req.file.mimetype, req.file.originalname);
      } catch (err) {
        console.error('Document parsing error:', err);
      }
    }

    const payload = {
      title: req.body.title,
      abstract: req.body.abstract,
      section: req.body.section,
      language: req.body.language,
      authors: req.body.authors ? JSON.parse(req.body.authors) : undefined,
      keywords: req.body.keywords ? JSON.parse(req.body.keywords) : undefined,
      file: req.file ? { mimetype: req.file.mimetype, size: req.file.size } : undefined,
      parsedDocument
    };

    const report = validationService.validateSubmissionReport(payload);
    res.json(report);
  } catch (error) {
    console.error('Error validating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
