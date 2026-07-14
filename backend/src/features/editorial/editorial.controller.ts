import { Request, Response } from 'express';
import { z } from 'zod';
import { editorialService } from './editorial.service.js';

const decisionSchema = z.object({
  decision: z.enum(['ACCEPTED', 'REJECTED', 'REVISIONS_REQUIRED']),
});

const publishSchema = z.object({
  volumeId: z.string().uuid().optional(),
  volumeNumber: z.string().optional(),
  year: z.string().optional(),
  journalId: z.string().uuid().optional(),
});

export const getSubmissions = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    let submissions;
    if (status) {
      submissions = await editorialService.getAllSubmissions(status);
    } else {
      submissions = await editorialService.getAllSubmissions();
    }
    res.json({ success: true, data: submissions });
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
    res.json({ success: true, data: updated });
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
    
    let published;
    if (validatedData.volumeId) {
      published = await editorialService.publishArticle(articleId, validatedData.volumeId);
    } else if (validatedData.volumeNumber && validatedData.year && validatedData.journalId) {
      published = await editorialService.publishArticleWithNewVolume(
        articleId,
        validatedData.journalId,
        validatedData.volumeNumber,
        validatedData.year
      );
    } else {
      return res.status(400).json({ error: 'Validation error: Either volumeId or volumeNumber, year, and journalId must be specified' });
    }

    if (!published) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ success: true, data: published });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error publishing article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
