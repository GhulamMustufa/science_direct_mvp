"use client";

import { useEffect, useState, useCallback } from "react";
import { Bookmark } from "@/types";
import { articlesService } from "../services/articles.service";

export function useBookmarks(limit = 10) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await articlesService.getBookmarks(page, limit);
      setBookmarks(res.bookmarks);
      setTotal(res.total);
    } catch (err: any) {
      setError(err.message || "Failed to load bookmarks.");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const removeBookmark = async (articleId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.article.id !== articleId));
    setTotal((prev) => Math.max(0, prev - 1));
    try {
      await articlesService.removeBookmark(articleId);
    } catch {
      fetchBookmarks(); // Rollback on failure
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    total,
    loading,
    error,
    page,
    setPage,
    removeBookmark,
    refresh: fetchBookmarks,
  };
}
