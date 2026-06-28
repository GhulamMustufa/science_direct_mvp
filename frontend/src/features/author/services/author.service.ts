import { apiFetch } from "@/lib/api";
import { Article } from "@/types";

export interface AuthorDashboardResponse {
  publications: Article[];
  totalViews: number;
  totalDownloads: number;
}

export const authorService = {
  async getAuthorDashboard(): Promise<AuthorDashboardResponse> {
    return apiFetch<AuthorDashboardResponse>("/author/dashboard");
  },
};
