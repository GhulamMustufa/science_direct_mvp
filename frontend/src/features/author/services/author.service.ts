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
    // FormData will contain title, abstract, pdf
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/submissions`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit article');
    }
    return res.json();
  },

  async validateArticle(formData: FormData): Promise<any> {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/submissions/validate`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to validate article');
    }
    return res.json();
  },

  async getMySubmissions(): Promise<SubmissionResponse[]> {
    return apiFetch<SubmissionResponse[]>("/submissions");
  },
  
  async uploadRevision(articleId: string, formData: FormData): Promise<SubmissionResponse> {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/submissions/${articleId}/revisions`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload revision');
    }
    return res.json();
  }
};
