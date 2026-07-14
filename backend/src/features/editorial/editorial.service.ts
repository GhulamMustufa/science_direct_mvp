import { editorialRepository } from './editorial.repository.js';

export class EditorialService {
  async getPendingSubmissions() {
    return await editorialRepository.getPendingSubmissions();
  }

  async getAllSubmissions(status?: string) {
    return await editorialRepository.getAllSubmissions(status);
  }

  async makeDecision(articleId: string, decision: 'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUIRED') {
    return await editorialRepository.updateSubmissionStatus(articleId, decision);
  }

  async publishArticle(articleId: string, volumeId: string) {
    return await editorialRepository.publishArticle(articleId, volumeId);
  }

  async publishArticleWithNewVolume(articleId: string, journalId: string, volumeNumber: string, year: string) {
    return await editorialRepository.publishArticleWithNewVolume(articleId, journalId, volumeNumber, year);
  }
}

export const editorialService = new EditorialService();
