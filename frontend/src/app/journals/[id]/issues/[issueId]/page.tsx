import Link from "next/link";
import { notFound } from "next/navigation";
import { journalsService } from "@/features/journals/services/journals.service";
import { ArticleCard } from "@/features/articles/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string; issueId: string }>;
}) {
  const { id, issueId } = await params;
  let issueData;

  try {
    const { issue, articles } = await journalsService.getIssueDetail(issueId);
    issueData = { issue, articles };
  } catch {
    notFound();
  }

  const { issue, articles } = issueData;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
      <div className="mb-6">
        <Link
          href={`/journals/${id}`}
          className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Journal Table of Contents
        </Link>
      </div>

      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <span className="inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
          Issue TOC
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl mt-3">
          Issue {issue.issueNumber} {issue.title ? `— ${issue.title}` : ""}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Published in {issue.year}
        </p>
      </div>

      <div className="space-y-6">
        {articles.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            No publications available in this issue.
          </p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
