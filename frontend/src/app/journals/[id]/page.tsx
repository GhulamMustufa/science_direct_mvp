import { notFound } from "next/navigation";
import { journalsService } from "@/features/journals/services/journals.service";
import { IssueList } from "@/features/journals/components/IssueList";

export const dynamic = "force-dynamic";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [{ journal, volumes }, issues] = await Promise.all([
      journalsService.getJournalDetail(id),
      journalsService.getIssuesForJournal(id).catch(() => []),
    ]);

    return (
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        <div className="border-b border-zinc-200 pb-8 mb-8 dark:border-zinc-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {journal.title}
          </h1>
          {journal.issn && (
            <p className="mt-2 text-xs font-mono text-zinc-400 dark:text-zinc-500">
              ISSN: {journal.issn}
            </p>
          )}
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            {journal.description || "No description available for this journal."}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Table of Contents
          </h2>
          <IssueList volumes={volumes} issues={issues} journalId={id} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
