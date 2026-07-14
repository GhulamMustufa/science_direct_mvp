import { apiFetch, apiFetchWithMeta } from "@/lib/api";
import { User } from "@/types";

export interface SyncJobResponse {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  startedAt: string;
  completedAt?: string;
  error?: string;
  progress?: string;
}

import { SubmissionResponse } from "@/features/author/services/author.service";

export const adminService = {
  async getUsers(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const res = await apiFetchWithMeta<User[]>(`/admin/users?limit=${limit}&offset=${offset}`);
    return {
      users: res.data,
      total: res.pagination?.total || 0,
    };
  },

  async changeUserRole(userId: string, role: string): Promise<User> {
    const res = await apiFetch<User>(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
    return res;
  },

  async getSubmissions(status?: string): Promise<SubmissionResponse[]> {
    const query = status ? `?status=${status}` : '';
    return apiFetch<SubmissionResponse[]>(`/editorial/submissions${query}`);
  },

  async makeDecision(articleId: string, decision: 'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUIRED'): Promise<SubmissionResponse> {
    return apiFetch<SubmissionResponse>(`/editorial/submissions/${articleId}/decision`, {
      method: "POST",
      body: JSON.stringify({ decision }),
    });
  },

  async publishArticle(
    articleId: string, 
    params: { volumeId?: string; volumeNumber?: string; year?: string; journalId?: string }
  ): Promise<SubmissionResponse> {
    return apiFetch<SubmissionResponse>(`/editorial/submissions/${articleId}/publish`, {
      method: "POST",
      body: JSON.stringify(params),
    });
  },
};
