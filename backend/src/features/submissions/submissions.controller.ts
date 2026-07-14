import { Request, Response } from 'express';
import { z } from 'zod';
import { submissionsService } from './submissions.service.js';

const submitSchema = z.object({
  title: z.string().min(5).max(500),
  abstract: z.string().min(10).max(4000),
  journalId: z.string().uuid().optional(),
  authorIds: z.union([z.string(), z.array(z.string())]).optional(),
  additionalAuthors: z.string().max(1000).optional(),
});

export const submitArticle = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id; // Assuming auth middleware sets req.user
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    const validatedData = submitSchema.parse(req.body);
    
    const article = await submissionsService.submitArticle(submitterId, validatedData, req.file);
    res.status(201).json(article);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
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

    if (!req.file) {
      return res.status(400).json({ error: 'Revised PDF file is required' });
    }

    const updatedArticle = await submissionsService.uploadRevision(submitterId, articleId, req.file);
    res.json(updatedArticle);
  } catch (error: any) {
    if (error.message === 'Unauthorized') return res.status(403).json({ error: error.message });
    if (error.message === 'Article not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Revisions are not currently required for this article') return res.status(400).json({ error: error.message });
    
    console.error('Error uploading revision:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
