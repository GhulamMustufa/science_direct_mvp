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
    const res = await apiFetch<{ user: User }>(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });
    return res.user;
  },

  async triggerSync(): Promise<{ jobId: string; status: string }> {
    return apiFetch<{ jobId: string; status: string }>("/admin/sync/trigger", {
      method: "POST",
    });
  },

  async getSyncStatus(jobId: string): Promise<SyncJobResponse> {
    return apiFetch<SyncJobResponse>(`/admin/sync/status/${jobId}`);
  },
};
