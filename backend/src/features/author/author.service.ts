import { AuthorRepository } from './author.repository.js';

export interface AuthorDashboardResponse {
  publications: any[];
  totalViews: number;
  totalDownloads: number;
}

export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}

  /**
   * Resolve the user's dashboard metrics and publications.
   */
  async getAuthorDashboard(userId: string): Promise<AuthorDashboardResponse> {
    const author = await this.authorRepository.findAuthorByUserId(userId);
    if (!author) {
      return {
        publications: [],
        totalViews: 0,
        totalDownloads: 0,
      };
    }

    const publications = await this.authorRepository.findPublicationsByAuthorId(author.id);

    const totalViews = publications.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalDownloads = publications.reduce((acc, curr) => acc + (curr.downloads || 0), 0);

    return {
      publications,
      totalViews,
      totalDownloads,
    };
  }
}
