import { apiFetch } from "@/lib/api";
import { Journal, Volume, Issue, Article } from "@/types";

export interface JournalDetailResponse {
  journal: Journal;
  volumes: Volume[];
}

export interface IssueDetailResponse {
  issue: Issue;
  articles: Article[];
}

export const journalsService = {
  async getJournals(): Promise<Journal[]> {
    return apiFetch<Journal[]>("/journals");
  },

  async getJournalDetail(id: string): Promise<JournalDetailResponse> {
    return apiFetch<JournalDetailResponse>(`/journals/${id}`);
  },

  async getIssuesForJournal(journalId: string): Promise<Issue[]> {
    return apiFetch<Issue[]>(`/journals/${journalId}/issues?limit=100`);
  },

  async getIssueDetail(issueId: string): Promise<IssueDetailResponse> {
    return apiFetch<IssueDetailResponse>(`/issues/${issueId}`);
  },
};
