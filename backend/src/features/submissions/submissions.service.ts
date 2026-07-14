import { submissionsRepository } from './submissions.repository.js';
import path from 'path';
import fs from 'fs';

export class SubmissionsService {
  async submitArticle(submitterId: string, data: any, file: Express.Multer.File) {
    // Generate a permanent URL/path for the file
    // In a real app with Firebase, we would upload to Firebase Storage here.
    // For MVP local storage, we just use the path where Multer saved it.
    const fileUrl = `/uploads/${file.filename}`;
    
    // Parse authorIds (assuming they might come as a JSON array string)
    let authorIds: string[] = [];
    if (data.authorIds) {
      try {
        authorIds = JSON.parse(data.authorIds);
      } catch (e) {
        if (typeof data.authorIds === 'string') {
          authorIds = [data.authorIds];
        } else if (Array.isArray(data.authorIds)) {
          authorIds = data.authorIds;
        }
      }
    }

    return await submissionsRepository.createSubmission(
      submitterId,
      data.title,
      data.abstract,
      data.journalId,
      authorIds,
      fileUrl,
      file.originalname,
      data.additionalAuthors
    );
  }

  async getMySubmissions(submitterId: string) {
    return await submissionsRepository.getSubmissionsBySubmitter(submitterId);
  }

  async uploadRevision(submitterId: string, articleId: string, file: Express.Multer.File) {
    const article = await submissionsRepository.getSubmissionById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }
    if (article.submitterId !== submitterId) {
      throw new Error('Unauthorized');
    }
    if (article.status !== 'REVISIONS_REQUIRED') {
      throw new Error('Revisions are not currently required for this article');
    }

    const fileUrl = `/uploads/${file.filename}`;
    return await submissionsRepository.addRevision(articleId, fileUrl, file.originalname);
  }
}

export const submissionsService = new SubmissionsService();
