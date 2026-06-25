import { JournalsRepository, DbJournal, DbVolume, ArticleWithAuthors } from './journals.repository.js';
import { AppError } from '../../middleware/error.js';

export interface JournalDetailResponse {
  journal: DbJournal;
  volumes: DbVolume[];
}

export interface IssueDetailResponse {
  issue: any; // Mapped issue details containing volume/journal headers
  articles: ArticleWithAuthors[];
}

export class JournalsService {
  constructor(private journalsRepository: JournalsRepository) {}

  /**
   * Get a paginated list of journals.
   */
  async getJournals(limit: number, offset: number) {
    return this.journalsRepository.findJournals(limit, offset);
  }

  /**
   * Get detail metadata of a journal with its associated volumes.
   */
  async getJournalDetail(id: string): Promise<JournalDetailResponse> {
    const journal = await this.journalsRepository.findJournalById(id);
    if (!journal) {
      throw new AppError(404, 'Journal not found', 'JOURNAL_NOT_FOUND');
    }

    const volumesList = await this.journalsRepository.findVolumesByJournalId(id);

    return {
      journal,
      volumes: volumesList,
    };
  }

  /**
   * Get paginated list of issues within a specific journal.
   */
  async getIssuesForJournal(journalId: string, limit: number, offset: number) {
    const journal = await this.journalsRepository.findJournalById(journalId);
    if (!journal) {
      throw new AppError(404, 'Journal not found', 'JOURNAL_NOT_FOUND');
    }

    return this.journalsRepository.findIssuesByJournalId(journalId, limit, offset);
  }

  /**
   * Get detail metadata of an issue with its article table of contents.
   */
  async getIssueDetail(id: string): Promise<IssueDetailResponse> {
    const issue = await this.journalsRepository.findIssueById(id);
    if (!issue) {
      throw new AppError(404, 'Issue not found', 'ISSUE_NOT_FOUND');
    }

    const articlesList = await this.journalsRepository.findArticlesByIssueId(id);

    return {
      issue,
      articles: articlesList,
    };
  }
}
