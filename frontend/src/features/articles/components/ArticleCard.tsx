import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { FileText } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const sortedAuthors = [...(article.authors || [])].sort(
    (a, b) => a.authorOrder - b.authorOrder
  );
  
  const authorsList = sortedAuthors
    .map((a) => `${a.details.firstName} ${a.details.lastName}`)
    .join(", ");

  const displayImageUrl = article.coverImageUrl || article.journalCoverImageUrl;

  return (
    <div className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 hover:shadow-md transition-shadow">
      {displayImageUrl ? (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <Image 
            src={displayImageUrl as string} 
            alt={article.title} 
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        {article.journalTitle && (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {article.journalTitle}
          </span>
        )}
        {article.volumeNumber && (
          <span>
            Vol {article.volumeNumber}, Issue {article.issueNumber || "1"}
          </span>
        )}
        <span>•</span>
        <span>{publishedDate}</span>
      </div>
      <Link href={`/articles/${article.id}`} className="mt-2 block group">
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 transition-colors">
          {article.title}
        </h3>
      </Link>
      {authorsList && (
        <p className="mt-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          By {authorsList}
        </p>
      )}
      <p className="mt-3 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {article.abstract}
      </p>
      <div className="mt-4 flex items-center justify-between">
        {article.doi ? (
          <a
            href={`https://doi.org/${article.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            DOI: {article.doi}
          </a>
        ) : (
          <span />
        )}
        <Link
          href={`/articles/${article.id}`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
        >
          View Full Text →
        </Link>
      </div>
      </div>
    </div>
  );
}
