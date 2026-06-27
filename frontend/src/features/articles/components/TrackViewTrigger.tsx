"use client";

import { useEffect } from "react";
import { articlesService } from "../services/articles.service";

export function TrackViewTrigger({ articleId }: { articleId: string }) {
  useEffect(() => {
    articlesService.trackView(articleId).catch((err) => {
      console.error("Failed to track article abstract view", err);
    });
  }, [articleId]);

  return null;
}
