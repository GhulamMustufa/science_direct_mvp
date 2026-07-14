import { AuthorRepository } from './author.repository.js';

export interface SubmissionResponse {
  id: string;
  title: string;
  journalTitle: string | null;
  status: 'submitted' | 'under_review' | 'revisions_required' | 'accepted' | 'rejected' | 'published';
  submittedAt: Date;
  lastStatusUpdate: Date | null;
  ojsUrl: string | null;
}

export interface AuthorDashboardResponse {
  publications: any[];
  submissions: SubmissionResponse[];
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
    const submissions = await this.authorRepository.findSubmissionsByAuthorId(userId);
    
    const publications = await this.authorRepository.findPublicationsByAuthorId(
      author ? author.id : null, 
      userId
    );

    const totalViews = publications.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalDownloads = publications.reduce((acc, curr) => acc + (curr.downloads || 0), 0);

    return {
      publications,
      submissions: submissions.map((sub) => ({
        id: sub.id,
        title: sub.title,
        journalTitle: "Science Direct", // Hardcoded or fetch from relationship if needed
        status: sub.status as SubmissionResponse['status'],
        submittedAt: sub.createdAt,
        lastStatusUpdate: sub.updatedAt,
        ojsUrl: null,
      })),
      totalViews,
      totalDownloads,
    };
  }
}
