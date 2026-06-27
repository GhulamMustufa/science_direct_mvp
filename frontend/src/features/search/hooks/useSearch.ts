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
        categoryId,
        keyword,
        limit,
        offset,
      });
      setArticles(res.data);
      setTotal(res.pagination?.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load search results.");
    } finally {
      setLoading(false);
    }
  }, [query, journalId, categoryId, keyword, page, limit]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  return {
    articles,
    total,
    loading,
    error,
    query,
    journalId,
    categoryId,
    keyword,
    page,
    limit,
  };
}
