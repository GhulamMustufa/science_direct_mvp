import crypto from 'crypto';
import { OjsClient, OjsJournal, OjsVolume, OjsIssue, OjsArticle, OjsSubmission } from './ojs.client.js';
import { SyncRepository } from './sync.repository.js';

export interface SyncJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  progress?: string;
}

// In-memory sync jobs tracking
export const syncJobs = new Map<string, SyncJob>();

export class SyncService {
  constructor(
    private ojsClient: OjsClient,
    private syncRepository: SyncRepository
  ) {}

  /**
   * Fetch the status of a sync job.
   */
  getJobStatus(jobId: string): SyncJob | null {
    return syncJobs.get(jobId) || null;
  }

  /**
   * Triggers a sync job in the background and returns the jobId immediately.
   */
  triggerSync(): string {
    const jobId = crypto.randomUUID();
    const job: SyncJob = {
      id: jobId,
      status: 'pending',
      startedAt: new Date(),
      progress: 'Job queued',
    };

    syncJobs.set(jobId, job);
    
    // Background execution
    this.runSync(jobId).catch((err) => {
      console.error(`Unhandled sync error for job ${jobId}:`, err);
    });

    return jobId;
  }

  /**
   * Main sync orchestration loop.
   */
  async runSync(jobId: string): Promise<void> {
    const job = syncJobs.get(jobId);
    if (!job) return;

    job.status = 'running';
    job.progress = 'Fetching journals from OJS';

    try {
      const ojsJournals = await this.ojsClient.fetchJournals();
      for (const oj of ojsJournals) {
        await this.syncJournal(oj);
      }
      job.progress = 'Syncing submission statuses';
      await this.syncSubmissions();
      job.status = 'completed';
      job.completedAt = new Date();
      job.progress = 'Synchronization completed successfully';
    } catch (error: any) {
      job.status = 'failed';
      job.completedAt = new Date();
      job.error = error.message || 'Unknown error occurred during sync';
    }
  }

  /**
   * Helper to sync a single journal and its volumes.
   */
  private async syncJournal(oj: OjsJournal): Promise<void> {
    const journal = await this.syncRepository.upsertJournal(oj);
    const volumes = await this.ojsClient.fetchVolumes(oj.ojsJournalId);
    
    for (const v of volumes) {
      await this.syncVolume(journal.id, oj.ojsJournalId, v);
    }
  }

  /**
   * Helper to sync a single volume and its issues.
   */
  private async syncVolume(
    journalId: string,
    ojsJournalId: string,
    ov: OjsVolume
  ): Promise<void> {
    const volume = await this.syncRepository.findOrCreateVolume(
      journalId,
      ov.volumeNumber,
      ov.year
    );
    const issues = await this.ojsClient.fetchIssues(ojsJournalId, ov.volumeNumber);

    for (const i of issues) {
      await this.syncIssue(volume.id, ojsJournalId, ov.volumeNumber, i);
    }
  }

  /**
   * Helper to sync a single issue and its articles.
   */
  private async syncIssue(
    volumeId: string,
    ojsJournalId: string,
    volumeNumber: string,
    oi: OjsIssue
  ): Promise<void> {
    const issue = await this.syncRepository.findOrCreateIssue(
      volumeId,
      oi.issueNumber,
      oi.year,
      oi.title
    );
    const articles = await this.ojsClient.fetchArticles(
      ojsJournalId,
      volumeNumber,
      oi.issueNumber
    );

    for (const a of articles) {
      await this.syncArticle(issue.id, a);
    }
  }

  /**
   * Helper to sync a single article and its authors.
   */
  private async syncArticle(issueId: string, oa: OjsArticle): Promise<void> {
    const article = await this.syncRepository.upsertArticle({
      issueId,
      ojsArticleId: oa.ojsArticleId,
      title: oa.title,
      abstract: oa.abstract,
      pdfUrl: oa.pdfUrl,
      doi: oa.doi,
      publishedAt: new Date(oa.publishedAt),
    });

    await this.syncAuthors(article.id, oa.ojsArticleId);
  }

  /**
   * Helper to sync authors of an article and their junction relations.
   */
  private async syncAuthors(articleId: string, ojsArticleId: string): Promise<void> {
    const ojsAuthors = await this.ojsClient.fetchAuthors(ojsArticleId);
    const authorAssociations: { authorId: string; authorOrder: number }[] = [];

    for (let index = 0; index < ojsAuthors.length; index++) {
      const oa = ojsAuthors[index];
      const author = await this.syncRepository.findOrCreateAuthor(oa);
      authorAssociations.push({
        authorId: author.id,
        authorOrder: index + 1, // 1-indexed order
      });
    }

    await this.syncRepository.syncArticleAuthors(articleId, authorAssociations);
  }

  private async syncSubmissions(): Promise<void> {
    const ojsSubmissions = await this.ojsClient.fetchSubmissions();
    for (const sub of ojsSubmissions) {
      if (!sub.authorEmail) {
        console.warn(`Submission ${sub.ojsSubmissionId} is missing author email, skipping.`);
        continue;
      }
      const author = await this.syncRepository.findAuthorByEmail(sub.authorEmail);
      if (author) {
        await this.syncRepository.upsertSubmission(author.id, {
          ojsSubmissionId: sub.ojsSubmissionId,
          title: sub.title,
          journalTitle: sub.journalTitle,
          status: sub.status,
          submittedAt: new Date(sub.submittedAt),
          lastStatusUpdate: new Date(sub.lastStatusUpdate),
          ojsUrl: sub.ojsUrl,
        });
      } else {
        console.warn(
          `Author with email ${sub.authorEmail} not found, skipping sync of submission ${sub.ojsSubmissionId}`
        );
      }
    }
  }
}
