import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Journal, Article } from "@/types";
import { ArticleCard } from "@/features/articles/components/ArticleCard";
import { JournalCard } from "@/features/journals/components/JournalCard";

export const dynamic = "force-dynamic";

function HeroSection() {
  return (
    <section 
      className="relative w-full overflow-hidden py-32 bg-zinc-900 bg-cover bg-center" 
      style={{ backgroundImage: "url('/images/hero-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
      
      <div className="relative container mx-auto max-w-4xl px-4 text-center z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-md">
          International Journal of Biochemical and Allied Health Research
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-200 drop-shadow">
          Search full-text journals, volumes, issues, and articles published on our platform.
        </p>
        <div className="mx-auto mt-10 max-w-2xl">
          <form className="relative flex items-center" action="/search" method="GET">
            <input
              type="text"
              name="query"
              placeholder="Search articles by title, abstract, DOI or keywords..."
              className="h-14 w-full rounded-full border border-white/20 bg-white/10 pl-6 pr-32 text-sm text-white placeholder-zinc-300 shadow-lg backdrop-blur-md focus:border-emerald-400 focus:outline-none focus:bg-white/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 h-10 rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-md"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function AimAndScopeSection() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/50 py-16 border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-8">Aim and Scope</h2>
        <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 text-justify">
          International Journal of Biochemical and Allied Health Research is a peer-reviewed platform dedicated to publishing high-quality research that connects basic Biochemical science with Medical and Allied Health. It focuses on advancing health sciences through innovation, evidence-based practice, and public health impact. The journal publishes research across all areas of Biological Sciences and Allied Health with focus on Biochemistry, Microbiology, Immunology, Molecular Genetics, Hematology, laboratory diagnostics, disease prognosis. It also welcomes contributions in Biotechnology, Nutrition, Pharmaceutical sciences, Physical Therapy (DPT), and Medicine, promoting interdisciplinary research and clinical advancements to improve patient care.
        </p>
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
      <AimAndScopeSection />
      
      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Recent Articles Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Recent Articles</h2>
              <Link href="/search" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
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
              <Link href="/journals" className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">
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
