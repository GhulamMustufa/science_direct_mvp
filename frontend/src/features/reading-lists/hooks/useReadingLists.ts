"use client";

import { useEffect, useState, useCallback } from "react";
import { ReadingList } from "@/types";
import { readingListsService } from "../services/reading-lists.service";

export function useReadingLists() {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await readingListsService.getReadingLists();
      setLists(data);
    } catch (err: any) {
      setError(err.message || "Failed to load reading lists.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createList = async (name: string, description?: string) => {
    try {
      const newList = await readingListsService.createReadingList(name, description);
      setLists((prev) => [...prev, newList]);
    } catch (err: any) {
      throw new Error(err.message || "Failed to create reading list.");
    }
  };

  const deleteList = async (id: string) => {
    setLists((prev) => prev.filter((item) => item.id !== id));
    try {
      await readingListsService.deleteReadingList(id);
    } catch {
      fetchLists(); // Rollback on failure
    }
  };

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  return {
    lists,
    loading,
    error,
    createList,
    deleteList,
    refreshLists: fetchLists,
  };
}
