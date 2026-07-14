"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { journalsService } from "@/features/journals/services/journals.service";
import { Journal } from "@/types";
import { TableSkeleton } from "@/components/ui/Loading";
import { Plus } from "lucide-react";

export default function AdminJournalsPage() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const data = await journalsService.getJournals();
      setJournals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Journal Management
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Create and edit journals on the platform.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/journals/new"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add New Journal
          </Link>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={5} />
      ) : journals.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500">
          No journals found. Create your first one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/30">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  ISSN
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-transparent">
              {journals.map((journal) => (
                <tr key={journal.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/10">
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {journal.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {journal.issn || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/journals/${journal.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
