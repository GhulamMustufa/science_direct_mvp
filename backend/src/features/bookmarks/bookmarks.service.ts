import { BookmarksRepository, DbBookmark } from './bookmarks.repository.js';
import { AppError } from '../../middleware/error.js';

export class BookmarksService {
  constructor(private bookmarksRepository: BookmarksRepository) {}

  /**
   * Get user's paginated list of bookmarked articles.
   */
  async getBookmarks(userId: string, limit: number, offset: number) {
    return this.bookmarksRepository.findBookmarks(userId, limit, offset);
  }

  /**
   * Bookmark an article for the user.
   * If previously bookmarked and deleted, it restores it.
   */
  async addBookmark(userId: string, articleId: string): Promise<DbBookmark> {
    const article = await this.bookmarksRepository.findArticleById(articleId);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    const existing = await this.bookmarksRepository.findBookmark(userId, articleId);
    if (existing) {
      if (existing.deletedAt === null) {
        return existing; // Idempotent success
      }
      return this.bookmarksRepository.restoreBookmark(existing.id);
    }

    return this.bookmarksRepository.createBookmark(userId, articleId);
  }

  /**
   * Remove a bookmark for an article (soft delete).
   */
  async removeBookmark(userId: string, articleId: string): Promise<void> {
    const article = await this.bookmarksRepository.findArticleById(articleId);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    const deleted = await this.bookmarksRepository.deleteBookmark(userId, articleId);
    if (!deleted) {
      throw new AppError(404, 'Bookmark not found', 'BOOKMARK_NOT_FOUND');
    }
  }
}
