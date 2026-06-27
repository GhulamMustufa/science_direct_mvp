import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Journal, Article } from "@/types";

export const dynamic = "force-dynamic";

function JournalCard({ journal }: { journal: Journal }) {
  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-900">
      <Link href={`/journals/${journal.id}`}>
        <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
          {journal.title}
        </h3>
      </Link>
      {journal.issn && (
        <span className="mt-1 inline-block text-xs font-medium text-zinc-400 dark:text-zinc-500">
          ISSN: {journal.issn}
        </span>
      )}
      <p className="mt-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
        {journal.description || "No description provided."}
      </p>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        {article.journalTitle && (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {article.journalTitle}
          </span>
        )}
        <span>•</span>
        <span>{publishedDate}</span>
      </div>
      <Link href={`/articles/${article.id}`} className="mt-2 block group">
        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
      </Link>
      <p className="mt-3 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400">
        {article.abstract}
      </p>
      {article.doi && (
        <span className="mt-4 block text-xs font-mono text-zinc-400">
          DOI: {article.doi}
        </span>
      )}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-zinc-50 py-20 dark:from-zinc-950/20 dark:via-zinc-950 dark:to-zinc-950">
      <div className="container mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
          Discover Peer-Reviewed Science
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400">
          Search full-text journals, volumes, issues, and articles published on ScienceDirect MVP.
        </p>
        <div className="mx-auto mt-10 max-w-2xl">
          <form className="relative flex items-center" action="/search" method="GET">
            <input
              type="text"
              name="query"
              placeholder="Search articles by title, abstract, DOI or keywords..."
              className="h-14 w-full rounded-full border border-zinc-200 bg-white/90 pl-6 pr-32 text-sm shadow-lg backdrop-blur focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-black/90 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const journals = await apiFetch<Journal[]>("/journals?limit=4").catch(() => []);
  const articles = await apiFetch<Article[]>("/articles?limit=5").catch(() => []);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection />
      
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Recent Articles Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recent Articles</h2>
              <Link href="/search" className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                View all articles
              </Link>
            </div>
            {articles.length === 0 ? (
              <p className="text-sm text-zinc-500">No articles available.</p>
            ) : (
              <div className="space-y-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Journals Column */}
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Featured Journals</h2>
              <Link href="/journals" className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Browse all
              </Link>
            </div>
            {journals.length === 0 ? (
              <p className="text-sm text-zinc-500">No journals available.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {journals.map((journal) => (
                  <JournalCard key={journal.id} journal={journal} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
