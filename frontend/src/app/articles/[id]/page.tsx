import Link from "next/link";
import { notFound } from "next/navigation";
import { articlesService } from "@/features/articles/services/articles.service";
import { PDFViewer } from "@/features/articles/components/PDFViewer";
import { BookmarkButton } from "@/features/articles/components/BookmarkButton";
import { TrackViewTrigger } from "@/features/articles/components/TrackViewTrigger";

export const dynamic = "force-dynamic";

function AuthorsList({ authors }: { authors: any[] }) {
  const sorted = [...authors].sort((a, b) => a.authorOrder - b.authorOrder);

  return (
    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
      {sorted.map((a, idx) => (
        <span key={idx} className="inline-flex items-center gap-1">
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {a.details.firstName} {a.details.lastName}
          </span>
          {a.details.orcid && (
            <a
              href={`https://orcid.org/${a.details.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] font-bold text-green-600 hover:text-green-700 bg-green-50 dark:bg-green-950/20 px-1 py-0.5 rounded border border-green-200 dark:border-green-900"
            >
              iD
            </a>
          )}
          {idx < sorted.length - 1 && <span className="text-zinc-300">,</span>}
        </span>
      ))}
    </div>
  );
}

function ArticleMetadata({ article }: { article: any }) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="text-xs text-zinc-400 dark:text-zinc-500 space-y-1">
      {article.journalTitle && (
        <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
          {article.journalTitle}
          {article.volumeNumber && `, Volume ${article.volumeNumber}`}
          {article.issueNumber && `, Issue ${article.issueNumber}`}
        </p>
      )}
      <p>Published on {publishedDate} • Views: {article.views} • Downloads: {article.downloads}</p>
      {article.doi && (
        <p>
          DOI:{" "}
          <a
            href={`https://doi.org/${article.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-zinc-500"
          >
            {article.doi}
          </a>
        </p>
      )}
    </div>
  );
}

function CategoryKeywords({ categories, keywords }: { categories: any[]; keywords: any[] }) {
  return (
    <div className="space-y-4 py-4 border-t border-b border-zinc-100 dark:border-zinc-800">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Categories:</span>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/search?categoryId=${c.id}`}
              className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Keywords:</span>
          {keywords.map((k) => (
            <Link
              key={k.id}
              href={`/search?keyword=${k.name}`}
              className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              {k.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const { article, authors, categories, keywords } = await articlesService.getArticleDetail(id);
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/articles/${id}/download`;

    return (
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <TrackViewTrigger articleId={id} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-6">
            <ArticleMetadata article={article} />
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
              {article.title}
            </h1>
            <AuthorsList authors={authors} />
            
            <CategoryKeywords categories={categories} keywords={keywords} />

            <div className="py-6">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-3">Abstract</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line bg-zinc-50 p-6 rounded-xl dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800">
                {article.abstract}
              </p>
            </div>

            <PDFViewer pdfUrl={article.pdfUrl} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 rounded-xl border border-zinc-200 bg-white shadow-sm space-y-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Article Actions</h3>
              <BookmarkButton articleId={id} />
              {article.pdfUrl && (
                <a href={downloadUrl} className="block">
                  <button className="w-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md py-2.5 shadow-sm transition-all">
                    Download PDF Document
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
