import { apiFetch } from "@/lib/api";
import { Article } from "@/types";

export interface SubmissionResponse {
  id: string;
  title: string;
  abstract: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVISIONS_REQUIRED' | 'ACCEPTED' | 'REJECTED' | 'PUBLISHED';
  createdAt?: string;
  submittedAt?: string;
  updatedAt?: string;
  volumeId?: string;
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
  
  async submitArticle(formData: FormData): Promise<SubmissionResponse> {
    return apiFetch<SubmissionResponse>("/submissions", {
      method: 'POST',
      body: formData
    });
  },

  async validateArticle(formData: FormData): Promise<any> {
    return apiFetch<any>("/submissions/validate", {
      method: 'POST',
      body: formData
    });
  },

  async getMySubmissions(): Promise<SubmissionResponse[]> {
    return apiFetch<SubmissionResponse[]>("/submissions");
  },
  
  async uploadRevision(articleId: string, formData: FormData): Promise<SubmissionResponse> {
    return apiFetch<SubmissionResponse>(`/submissions/${articleId}/revisions`, {
      method: 'POST',
      body: formData
    });
  },

  async validateRevision(articleId: string, formData: FormData): Promise<any> {
    return apiFetch<any>(`/submissions/${articleId}/revisions/validate`, {
      method: 'POST',
      body: formData
    });
  }
};
