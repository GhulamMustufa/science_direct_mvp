import { submissionsRepository } from './submissions.repository.js';
import path from 'path';
import fs from 'fs';
import cloudinary from '../storage/cloudinary.js';

export class SubmissionsService {
  async submitArticle(submitterId: string, data: any, file: Express.Multer.File, coverImageFile?: Express.Multer.File) {
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw', // Use raw for PDFs/docs
      folder: 'manuscripts',
    });
    const fileUrl = uploadResult.secure_url;

    let coverImageUrl: string | undefined = undefined;
    if (coverImageFile) {
      const coverUploadResult = await cloudinary.uploader.upload(coverImageFile.path, {
        resource_type: 'image',
        folder: 'article_covers',
      });
      coverImageUrl = coverUploadResult.secure_url;
      try {
        fs.unlinkSync(coverImageFile.path);
      } catch (err) {
        console.error(`Failed to delete temporary cover file ${coverImageFile.path}:`, err);
      }
    }

    // Delete the local file after successful upload
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error(`Failed to delete temporary file ${file.path}:`, err);
    }
    
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

    let categoryIds: string[] = [];
    if (data.categoryIds) {
      try {
        categoryIds = JSON.parse(data.categoryIds);
      } catch (e) {
        if (typeof data.categoryIds === 'string') {
          categoryIds = [data.categoryIds];
        } else if (Array.isArray(data.categoryIds)) {
          categoryIds = data.categoryIds;
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
      data.additionalAuthors,
      coverImageUrl,
      categoryIds
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

    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: 'raw',
      folder: 'revisions',
    });
    const fileUrl = uploadResult.secure_url;

    // Delete the local file after successful upload
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.error(`Failed to delete temporary file ${file.path}:`, err);
    }
    return await submissionsRepository.addRevision(articleId, fileUrl, file.originalname);
  }
}

export const submissionsService = new SubmissionsService();
