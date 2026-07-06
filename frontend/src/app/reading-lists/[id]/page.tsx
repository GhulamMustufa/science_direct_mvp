"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { readingListsService, ReadingListDetailResponse } from "@/features/reading-lists/services/reading-lists.service";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { ReadingList, Article } from "@/types";
import { ArticleListSkeleton } from "@/components/ui/Loading";

function ListHeader({ readingList }: { readingList: ReadingList }) {
  return (
    <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {readingList.name}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {readingList.description || "No description provided."}
      </p>
    </div>
  );
}

function ArticleListEntry({
  article,
  onRemove,
}: {
  article: Article;
  onRemove: (articleId: string) => Promise<void>;
}) {
  return (
    <div className="relative group">
      <ArticleCard article={article} />
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(article.id)}
          className="text-xs h-8 px-3 shadow"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default function ReadingListDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [detail, setDetail] = useState<ReadingListDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await readingListsService.getReadingListDetail(id);
      setDetail(res);
    } catch {
      router.push("/reading-lists");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchDetail();
    }
  }, [user, authLoading, fetchDetail, router]);

  const handleRemoveArticle = async (articleId: string) => {
    if (!detail) return;
    setDetail({
      ...detail,
      articles: detail.articles.filter((a) => a.id !== articleId),
    });
    try {
      await readingListsService.removeArticleFromList(id, articleId);
    } catch {
      fetchDetail(); // Rollback on failure
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {authLoading || loading || !detail ? (
        <>
          <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800 animate-pulse">
            <div className="h-9 w-48 bg-zinc-250 dark:bg-zinc-800 rounded mb-2" />
            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
          <ArticleListSkeleton count={2} />
        </>
      ) : (
        <>
          <ListHeader readingList={detail.readingList} />

          {detail.articles.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500">
              This reading list is currently empty.
            </div>
          ) : (
            <div className="space-y-6">
              {detail.articles.map((article) => (
                <ArticleListEntry
                  key={article.id}
                  article={article}
                  onRemove={handleRemoveArticle}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
