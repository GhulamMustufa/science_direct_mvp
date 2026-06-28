import { apiFetch, apiFetchWithMeta } from "@/lib/api";
import { Article, Bookmark, Category, Keyword, Author } from "@/types";

export interface ArticleDetailResponse {
  article: Article;
  authors: { authorOrder: number; details: Author }[];
  categories: Category[];
  keywords: Keyword[];
}

export const articlesService = {
  async getArticleDetail(id: string): Promise<ArticleDetailResponse> {
    return apiFetch<ArticleDetailResponse>(`/articles/${id}`);
  },

  async trackView(id: string): Promise<void> {
    await apiFetch<void>(`/articles/${id}/view`, {
      method: "POST",
    });
  },

  async getBookmarks(page = 1, limit = 10): Promise<{ bookmarks: Bookmark[]; total: number }> {
    const offset = (page - 1) * limit;
    const res = await apiFetchWithMeta<Bookmark[]>(`/bookmarks?limit=${limit}&offset=${offset}`);
    return {
      bookmarks: res.data,
      total: res.pagination?.total || 0,
    };
  },

  async addBookmark(articleId: string): Promise<void> {
    await apiFetch<void>("/bookmarks", {
      method: "POST",
      body: JSON.stringify({ articleId }),
    });
  },

  async removeBookmark(articleId: string): Promise<void> {
    await apiFetch<void>(`/bookmarks/${articleId}`, {
      method: "DELETE",
    });
  },

  async checkIsBookmarked(articleId: string): Promise<boolean> {
    try {
      const list = await apiFetch<Bookmark[]>("/bookmarks?limit=100");
      return list.some((b) => b.article.id === articleId);
    } catch {
      return false;
    }
  },
};
