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
    
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const pdfFile = files?.['pdf']?.[0];
    const coverImageFile = files?.['coverImage']?.[0];
    let parsedDocument;
    if (pdfFile) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(pdfFile.path);
        parsedDocument = await documentParserService.parseDocument(buffer, pdfFile.mimetype, pdfFile.originalname);
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
      file: pdfFile ? { mimetype: pdfFile.mimetype, size: pdfFile.size } : undefined,
      parsedDocument
    };

    const validationResult = validationService.validateSubmission(payload);
    if (!validationResult.isValid) {
      return res.status(400).json({ error: 'Validation error', details: validationResult.errors });
    }

    const mergedData = {
      ...req.body,
      title: req.body.title || parsedDocument?.title,
      abstract: req.body.abstract || parsedDocument?.abstract,
    };

    const article = await submissionsService.submitArticle(submitterId, mergedData, pdfFile!, coverImageFile);
    res.status(201).json({ success: true, data: article });
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
    res.json({ success: true, data: submissions });
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

    // Need to fetch existing article for validation payload
    const { submissionsRepository } = await import('./submissions.repository.js');
    const existingArticle = await submissionsRepository.getSubmissionById(articleId);
    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const pdfFile = files?.['pdf']?.[0];
    const coverImageFile = files?.['coverImage']?.[0];
    let parsedDocument;
    if (pdfFile) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(pdfFile.path);
        parsedDocument = await documentParserService.parseDocument(buffer, pdfFile.mimetype, pdfFile.originalname);
      } catch (err) {
        console.error('Document parsing error:', err);
      }
    }

    // We pass dummy data for fields that aren't being updated in the revision 
    // to pass the Metadata and Author validators, as we only care about the new PDF structure.
    const payload = {
      title: existingArticle.title,
      abstract: existingArticle.abstract,
      section: "Research Article", 
      language: "en",
      authors: [{ firstName: 'Author', lastName: 'Name', email: 'author@test.com', affiliation: 'Test', isCorresponding: true }],
      file: pdfFile ? { mimetype: pdfFile.mimetype, size: pdfFile.size } : undefined,
      parsedDocument
    };

    const report = validationService.validateSubmissionReport(payload);
    
    let hasStructuralOrFileErrors = false;
    let errorMsg = 'Your revised PDF failed automated validation:\n';
    const categoriesToCheck = ['File', 'Structure'];
    
    for (const cat of categoriesToCheck) {
      if (report.categories[cat] && report.categories[cat].issues) {
        const catErrors = report.categories[cat].issues.filter((i: any) => i.severity === 'error');
        if (catErrors.length > 0) {
          hasStructuralOrFileErrors = true;
          catErrors.forEach((i: any) => {
            errorMsg += `- ${i.message} (${i.field})\n`;
          });
        }
      }
    }

    if (hasStructuralOrFileErrors) {
      return res.status(400).json({
        success: false,
        error: {
          message: errorMsg,
          code: 'VALIDATION_FAILED',
          details: [report]
        }
      });
    }

    const updatedArticle = await submissionsService.uploadRevision(submitterId, articleId, pdfFile!);
    res.json({ success: true, data: updatedArticle });
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const pdfFile = files?.['pdf']?.[0];
    const coverImageFile = files?.['coverImage']?.[0];
    let parsedDocument;
    if (pdfFile) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(pdfFile.path);
        parsedDocument = await documentParserService.parseDocument(buffer, pdfFile.mimetype, pdfFile.originalname);
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
      file: pdfFile ? { mimetype: pdfFile.mimetype, size: pdfFile.size } : undefined,
      parsedDocument
    };

    const report = validationService.validateSubmissionReport(payload);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error validating article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateRevision = async (req: Request, res: Response) => {
  try {
    const submitterId = req.user?.id;
    if (!submitterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const pdfFile = files?.['pdf']?.[0];
    const coverImageFile = files?.['coverImage']?.[0];
    let parsedDocument;
    if (pdfFile) {
      try {
        const fs = await import('fs/promises');
        const buffer = await fs.readFile(pdfFile.path);
        parsedDocument = await documentParserService.parseDocument(buffer, pdfFile.mimetype, pdfFile.originalname);
      } catch (err) {
        console.error('Document parsing error:', err);
      }
    }

    const payload = {
      title: "Dummy",
      abstract: "Dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy dummy",
      section: "Research Article", 
      language: "en",
      authors: [{ firstName: 'Author', lastName: 'Name', email: 'author@test.com', affiliation: 'Test', isCorresponding: true }],
      keywords: ["test1", "test2", "test3"],
      file: pdfFile ? { mimetype: pdfFile.mimetype, size: pdfFile.size } : undefined,
      parsedDocument
    };

    const report = validationService.validateSubmissionReport(payload);
    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error validating revision:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
