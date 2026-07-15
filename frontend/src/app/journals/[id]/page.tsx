import { notFound } from "next/navigation";
import { journalsService } from "@/features/journals/services/journals.service";
import { IssueList } from "@/features/journals/components/IssueList";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let journalData;

  try {
    const [{ journal, volumes }, issues] = await Promise.all([
      journalsService.getJournalDetail(id),
      journalsService.getIssuesForJournal(id).catch(() => []),
    ]);
    journalData = { journal, volumes, issues };
  } catch {
    notFound();
  }

  const { journal, volumes, issues } = journalData;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
      <div className="border-b border-zinc-200 pb-8 mb-8 dark:border-zinc-800 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 h-64 md:h-auto flex-shrink-0 relative bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
          {journal.coverImageUrl ? (
            <Image 
              src={journal.coverImageUrl as string}
              alt={journal.title}
              fill
              className="object-cover"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
          )}
        </div>
        <div>
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
      </div>

      <div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Volumes and Issues
        </h2>
        {volumes.length === 0 ? (
          <p className="text-sm text-zinc-500">No volumes have been published for this journal yet.</p>
        ) : (
          <IssueList volumes={volumes} issues={issues} journalId={id} />
        )}
      </div>
    </div>
  );
}
