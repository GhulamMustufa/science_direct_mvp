"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { journalsService } from "@/features/journals/services/journals.service";
import { FormPageSkeleton } from "@/components/ui/Loading";

export default function EditJournalPage() {
  const router = useRouter();
  const params = useParams();
  const journalId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issn: "",
  });

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const data = await journalsService.getJournalDetail(journalId);
        setFormData({
          title: data.journal.title || "",
          description: data.journal.description || "",
          issn: data.journal.issn || "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load journal details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (journalId) {
      fetchJournal();
    }
  }, [journalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.updateJournal(journalId, formData);
      router.push("/admin/journals");
    } catch (err: any) {
      setError(err.message || "Failed to update journal");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FormPageSkeleton />;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/journals"
          className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit Journal
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Update the details for this journal.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/50 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Journal Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="issn" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              ISSN (Optional)
            </label>
            <input
              type="text"
              id="issn"
              value={formData.issn}
              onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
              placeholder="e.g. 1234-5678"
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/journals"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
