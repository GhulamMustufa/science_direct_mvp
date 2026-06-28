import { apiFetch } from "@/lib/api";
import { Article } from "@/types";

export interface SubmissionResponse {
  id: string;
  title: string;
  journalTitle: string | null;
  status: 'submitted' | 'under_review' | 'revisions_required' | 'accepted' | 'rejected' | 'published';
  submittedAt: string;
  lastStatusUpdate: string | null;
  ojsUrl: string | null;
}

export interface AuthorDashboardResponse {
  publications: Article[];
  submissions: SubmissionResponse[];
  totalViews: number;
  totalDownloads: number;
}

export const authorService = {
  async getAuthorDashboard(): Promise<AuthorDashboardResponse> {
    return apiFetch<AuthorDashboardResponse>("/author/dashboard");
  },
};
