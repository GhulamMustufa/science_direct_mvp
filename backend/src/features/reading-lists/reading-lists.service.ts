import { ReadingListsRepository, DbReadingList } from './reading-lists.repository.js';
import { AppError } from '../../middleware/error.js';

export interface ReadingListDetailResponse {
  readingList: DbReadingList;
  articles: any[];
}

export class ReadingListsService {
  constructor(private readingListsRepository: ReadingListsRepository) {}

  /**
   * Get all active reading lists for the user.
   */
  async getReadingLists(userId: string): Promise<DbReadingList[]> {
    return this.readingListsRepository.findReadingListsByUserId(userId);
  }

  /**
   * Get detail of a reading list including its articles.
   * Validates user ownership.
   */
  async getReadingListDetail(userId: string, id: string): Promise<ReadingListDetailResponse> {
    const list = await this.readingListsRepository.findReadingListById(id);
    if (!list || list.userId !== userId) {
      throw new AppError(404, 'Reading list not found', 'READING_LIST_NOT_FOUND');
    }

    const articles = await this.readingListsRepository.findArticlesInReadingList(id);

    return {
      readingList: list,
      articles,
    };
  }

  /**
   * Create a new reading list.
   */
  async createReadingList(
    userId: string,
    data: { name: string; description?: string }
  ): Promise<DbReadingList> {
    return this.readingListsRepository.createReadingList(userId, data);
  }

  /**
   * Update reading list metadata.
   * Validates user ownership.
   */
  async updateReadingList(
    userId: string,
    id: string,
    data: { name?: string; description?: string }
  ): Promise<DbReadingList> {
    const list = await this.readingListsRepository.findReadingListById(id);
    if (!list || list.userId !== userId) {
      throw new AppError(404, 'Reading list not found', 'READING_LIST_NOT_FOUND');
    }

    return this.readingListsRepository.updateReadingList(id, data);
  }

  /**
   * Soft-delete a reading list.
   * Validates user ownership.
   */
  async deleteReadingList(userId: string, id: string): Promise<void> {
    const list = await this.readingListsRepository.findReadingListById(id);
    if (!list || list.userId !== userId) {
      throw new AppError(404, 'Reading list not found', 'READING_LIST_NOT_FOUND');
    }

    await this.readingListsRepository.deleteReadingList(id);
  }

  /**
   * Add an article to a user's reading list.
   * Validates ownership, article existence, and checks for duplication.
   */
  async addArticle(userId: string, readingListId: string, articleId: string): Promise<void> {
    const list = await this.readingListsRepository.findReadingListById(readingListId);
    if (!list || list.userId !== userId) {
      throw new AppError(404, 'Reading list not found', 'READING_LIST_NOT_FOUND');
    }

    const article = await this.readingListsRepository.findArticleById(articleId);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    const alreadyLinked = await this.readingListsRepository.findArticleInList(
      readingListId,
      articleId
    );
    if (alreadyLinked) {
      return; // Idempotent success
    }

    await this.readingListsRepository.addArticleToList(readingListId, articleId);
  }

  /**
   * Remove an article from a user's reading list.
   * Validates ownership and junction existence.
   */
  async removeArticle(userId: string, readingListId: string, articleId: string): Promise<void> {
    const list = await this.readingListsRepository.findReadingListById(readingListId);
    if (!list || list.userId !== userId) {
      throw new AppError(404, 'Reading list not found', 'READING_LIST_NOT_FOUND');
    }

    const article = await this.readingListsRepository.findArticleById(articleId);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    const deleted = await this.readingListsRepository.removeArticleFromList(
      readingListId,
      articleId
    );
    if (!deleted) {
      throw new AppError(404, 'Article not found in this reading list', 'ARTICLE_NOT_FOUND_IN_LIST');
    }
  }
}
