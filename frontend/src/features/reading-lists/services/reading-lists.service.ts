import { apiFetch } from "@/lib/api";
import { ReadingList, Article } from "@/types";

export interface ReadingListDetailResponse {
  readingList: ReadingList;
  articles: Article[];
}

export const readingListsService = {
  async getReadingLists(): Promise<ReadingList[]> {
    return apiFetch<ReadingList[]>("/reading-lists");
  },

  async createReadingList(name: string, description?: string): Promise<ReadingList> {
    return apiFetch<ReadingList>("/reading-lists", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });
  },

  async deleteReadingList(id: string): Promise<void> {
    await apiFetch<void>(`/reading-lists/${id}`, {
      method: "DELETE",
    });
  },

  async getReadingListDetail(id: string): Promise<ReadingListDetailResponse> {
    return apiFetch<ReadingListDetailResponse>(`/reading-lists/${id}`);
  },

  async removeArticleFromList(listId: string, articleId: string): Promise<void> {
    await apiFetch<void>(`/reading-lists/${listId}/articles/${articleId}`, {
      method: "DELETE",
    });
  },
};
