import { ArticlesRepository, SearchOptions } from './articles.repository.js';
import { AppError } from '../../middleware/error.js';

export interface ArticleDetailResponse {
  article: any;
  authors: any[];
  categories: any[];
  keywords: any[];
}

export class ArticlesService {
  constructor(private articlesRepository: ArticlesRepository) {}

  /**
   * Search articles with full-text search and filters.
   */
  async searchArticles(options: SearchOptions) {
    return this.articlesRepository.findArticles(options);
  }

  /**
   * Retrieve full details of an article (metadata, authors, categories, keywords).
   */
  async getArticleDetail(id: string): Promise<ArticleDetailResponse> {
    const article = await this.articlesRepository.findArticleById(id);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    const [authors, categories, keywords] = await Promise.all([
      this.articlesRepository.findAuthorsByArticleId(id),
      this.articlesRepository.findCategoriesByArticleId(id),
      this.articlesRepository.findKeywordsByArticleId(id),
    ]);

    return {
      article,
      authors,
      categories,
      keywords,
    };
  }

  /**
   * Track an abstract view and increment its views counter.
   */
  async trackView(id: string): Promise<void> {
    const article = await this.articlesRepository.findArticleById(id);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    await this.articlesRepository.incrementViews(id);
  }

  /**
   * Track a PDF download and return the redirect URL.
   */
  async trackDownload(id: string): Promise<string> {
    const article = await this.articlesRepository.findArticleById(id);
    if (!article) {
      throw new AppError(404, 'Article not found', 'ARTICLE_NOT_FOUND');
    }

    await this.articlesRepository.incrementDownloads(id);

    // Default to a placeholder if pdfUrl is missing in the database
    return article.pdfUrl || 'https://example.com/placeholder-article.pdf';
  }
}
