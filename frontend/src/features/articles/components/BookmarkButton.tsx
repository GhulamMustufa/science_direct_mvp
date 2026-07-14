"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { articlesService } from "../services/articles.service";
import { Button } from "@/components/ui/button";

export function BookmarkButton({ articleId }: { articleId: string }) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
      return;
    }
    async function loadBookmarkStatus() {
      const status = await articlesService.checkIsBookmarked(articleId);
      setIsBookmarked(status);
      setChecking(false);
    }
    loadBookmarkStatus();
  }, [articleId, user]);

  const toggleBookmark = async () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState); // Optimistic UI update
    try {
      if (nextState) {
        await articlesService.addBookmark(articleId);
      } else {
        await articlesService.removeBookmark(articleId);
      }
    } catch {
      setIsBookmarked(!nextState); // Rollback on error
    }
  };

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-2 border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-950">
          ☆ Bookmark
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
      disabled={checking}
      onClick={toggleBookmark}
      className={`w-full text-xs font-semibold gap-2 transition-all ${
        isBookmarked 
          ? "bg-emerald-600 text-white hover:bg-emerald-700" 
          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-950"
      }`}
    >
      {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </Button>
  );
}
