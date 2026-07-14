import { Request, Response } from 'express';
import { z } from 'zod';
import { editorialService } from './editorial.service.js';

const decisionSchema = z.object({
  decision: z.enum(['ACCEPTED', 'REJECTED', 'REVISIONS_REQUIRED']),
});

const publishSchema = z.object({
  volumeId: z.string().uuid(),
});

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    let submissions;
    if (status === 'SUBMITTED') {
      submissions = await editorialService.getPendingSubmissions();
    } else {
      submissions = await editorialService.getAllSubmissions();
    }
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching editorial submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const makeDecision = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const validatedData = decisionSchema.parse(req.body);
    
    const updated = await editorialService.makeDecision(articleId, validatedData.decision);
    if (!updated) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error making decision:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const publishArticle = async (req: Request, res: Response) => {
  try {
    const articleId = req.params.id;
    const validatedData = publishSchema.parse(req.body);
    
    const published = await editorialService.publishArticle(articleId, validatedData.volumeId);
    if (!published) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(published);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error publishing article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
