"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Article } from "@/types";
import { searchService } from "../services/search.service";

export function useSearch(limit = 10) {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get("query") || "";
  const journalId = searchParams.get("journalId") || "";
  const volumeId = searchParams.get("volumeId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const executeSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * limit;
      const res = await searchService.searchArticles({
        query,
        journalId,
        volumeId,
        categoryId,
        keyword,
        limit,
        offset,
      });
      setArticles(res.data);
      setTotal(res.pagination?.total || 0);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load search results.");
    } finally {
      setLoading(false);
    }
  }, [query, journalId, volumeId, categoryId, keyword, page, limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    executeSearch();
  }, [executeSearch]);

  return {
    articles,
    total,
    loading,
    error,
    query,
    journalId,
    volumeId,
    categoryId,
    keyword,
    page,
    limit,
  };
}
