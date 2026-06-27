"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchService } from "../services/search.service";
import { Journal, Category } from "@/types";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedJournal = searchParams.get("journalId") || "";
  const selectedCategory = searchParams.get("categoryId") || "";

  useEffect(() => {
    async function loadFilters() {
      try {
        const [journalsData, categoriesData] = await Promise.all([
          searchService.getJournals(),
          searchService.getCategories(),
        ]);
        setJournals(journalsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load search filter options", err);
      }
    }
    loadFilters();
  }, []);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Filter by Journal</h3>
        <select
          value={selectedJournal}
          onChange={(e) => updateParam("journalId", e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">All Journals</option>
          {journals.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Filter by Category</h3>
        <select
          value={selectedCategory}
          onChange={(e) => updateParam("categoryId", e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
