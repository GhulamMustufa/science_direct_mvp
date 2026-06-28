"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBookmarks } from "@/features/articles/hooks/useBookmarks";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Bookmark } from "@/types";

function BookmarkListEntry({ bookmark, onRemove }: { bookmark: Bookmark; onRemove: (id: string) => void }) {
  return (
    <div className="relative group">
      <ArticleCard article={bookmark.article} />
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(bookmark.article.id)}
          className="text-xs h-8 px-3 shadow"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { bookmarks, total, loading, page, setPage, removeBookmark } = useBookmarks();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-zinc-500">Loading Bookmarks...</div>;
  }

  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your Bookmarks
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Curation dashboard containing saved research publications.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500">
          You haven&apos;t bookmarked any publications yet.
        </div>
      ) : (
        <div className="space-y-6 flex-1">
          {bookmarks.map((b) => (
            <BookmarkListEntry key={b.id} bookmark={b} onRemove={removeBookmark} />
          ))}

          {total > 10 && (
            <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
