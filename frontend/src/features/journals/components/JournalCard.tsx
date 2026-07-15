import Link from "next/link";
import Image from "next/image";
import { Journal } from "@/types";
import { BookOpen } from "lucide-react";

export function JournalCard({ journal }: { journal: Journal }) {
  return (
    <div className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-emerald-900">
      {journal.coverImageUrl ? (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <Image 
            src={journal.coverImageUrl as string} 
            alt={journal.title} 
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-600" />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
      <Link href={`/journals/${journal.id}`}>
        <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 transition-colors">
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
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
        >
          View Journal Details →
        </Link>
      </div>
      </div>
    </div>
  );
}
