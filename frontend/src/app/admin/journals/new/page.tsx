"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";

export default function NewJournalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    issn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    if (formData.description) data.append('description', formData.description);
    if (formData.issn) data.append('issn', formData.issn);
    if (coverImage) data.append('coverImage', coverImage);

    setIsSubmitting(true);
    setError(null);
    try {
      await adminService.createJournal(data);
      router.push("/admin/journals");
    } catch (err: any) {
      setError(err.message || "Failed to create journal");
      setIsSubmitting(false);
    }
  };

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
            Create New Journal
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Enter the details for the new journal.
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

                    <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
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
              {isSubmitting ? "Creating..." : "Create Journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
