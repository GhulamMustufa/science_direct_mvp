import { journalsService } from "@/features/journals/services/journals.service";
import { JournalCard } from "@/features/journals/components/JournalCard";

export const dynamic = "force-dynamic";

export default async function JournalsPage() {
  const journals = await journalsService.getJournals().catch(() => []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Browse Journals
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Explore publications and view table of contents by volumes and issues.
        </p>
      </div>

      {journals.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
          No journals available in the catalog.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {journals.map((journal) => (
            <JournalCard key={journal.id} journal={journal} />
          ))}
        </div>
      )}
    </div>
  );
}
