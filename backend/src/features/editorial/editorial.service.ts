import { editorialRepository } from './editorial.repository.js';

export class EditorialService {
  async getPendingSubmissions() {
    return await editorialRepository.getPendingSubmissions();
  }

  async getAllSubmissions() {
    return await editorialRepository.getAllSubmissions();
  }

  async makeDecision(articleId: string, decision: 'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUIRED') {
    return await editorialRepository.updateSubmissionStatus(articleId, decision);
  }

  async publishArticle(articleId: string, volumeId: string) {
    return await editorialRepository.publishArticle(articleId, volumeId);
  }
}

export const editorialService = new EditorialService();
