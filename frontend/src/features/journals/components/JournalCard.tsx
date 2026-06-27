import Link from "next/link";
import { Journal } from "@/types";

export function JournalCard({ journal }: { journal: Journal }) {
  return (
    <div className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-900">
      <Link href={`/journals/${journal.id}`}>
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400 transition-colors">
          {journal.title}
        </h3>
      </Link>
      {journal.issn && (
        <span className="mt-1.5 inline-block text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          ISSN: {journal.issn}
        </span>
      )}
      <p className="mt-3 line-clamp-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
        {journal.description || "No description available for this journal."}
      </p>
      <div className="mt-4 flex items-center justify-end">
        <Link
          href={`/journals/${journal.id}`}
          className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          View Journal Details →
        </Link>
      </div>
    </div>
  );
}
