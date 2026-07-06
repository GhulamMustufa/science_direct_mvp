"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { SearchFilters } from "./SearchFilters";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { useSearch } from "../hooks/useSearch";
import { Button } from "@/components/ui/button";
import { ArticleListSkeleton } from "@/components/ui/Loading";

function PaginationControls({
  page,
  total,
  limit,
  onPageChange,
}: {
  page: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-zinc-500">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export function SearchDashboard() {
  const router = useRouter();
  const { articles, total, loading, error, page, limit } = useSearch();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(newPage));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Search Publications
        </h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 flex-1">
        <aside className="lg:col-span-1">
          <SearchFilters />
        </aside>

        <main className="lg:col-span-3 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {loading ? "Searching..." : `Found ${total} articles matching your criteria`}
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            {loading ? (
              <ArticleListSkeleton count={3} />
            ) : (
              <>
                {articles.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
                    <p className="text-sm text-zinc-500">No publications matched your search.</p>
                  </div>
                )}

                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </>
            )}
          </div>

          {!loading && total > 0 && (
            <PaginationControls
              page={page}
              total={total}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}
