import { apiFetch, apiFetchWithMeta, ApiResponse } from "@/lib/api";
import { Article, Journal, Keyword, Volume } from "@/types";

export interface SearchParams {
  query?: string;
  journalId?: string;
  volumeId?: string;
  categoryId?: string;
  keyword?: string;
  limit?: number;
  offset?: number;
}

export const searchService = {
  async searchArticles(params: SearchParams): Promise<ApiResponse<Article[]>> {
    const q = new URLSearchParams();
    if (params.query) q.set("query", params.query);
    if (params.journalId) q.set("journalId", params.journalId);
    if (params.volumeId) q.set("volumeId", params.volumeId);
    if (params.categoryId) q.set("categoryId", params.categoryId);
    if (params.keyword) q.set("keyword", params.keyword);
    if (params.limit !== undefined) q.set("limit", String(params.limit));
    if (params.offset !== undefined) q.set("offset", String(params.offset));

    return apiFetchWithMeta<Article[]>(`/articles?${q.toString()}`);
  },

  async getJournals(): Promise<Journal[]> {
    return apiFetch<Journal[]>("/journals");
  },

  async getKeywords(): Promise<Keyword[]> {
    return apiFetch<Keyword[]>("/keywords");
  },

  async getCategories(): Promise<any[]> {
    return apiFetch<any[]>("/categories");
  },

  async getVolumes(): Promise<Volume[]> {
    return apiFetch<Volume[]>("/volumes");
  },
};
