"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/features/admin/services/admin.service";
import { SubmissionResponse } from "@/features/author/services/author.service";

export default function AdminSubmissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const [submission, setSubmission] = useState<SubmissionResponse & { pdfUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [decision, setDecision] = useState<'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUIRED'>('REVISIONS_REQUIRED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volumeId, setVolumeId] = useState("");

  const loadSubmission = async () => {
    try {
      // In a real app, we'd have a `adminService.getSubmissionById` endpoint.
      // For now we reuse the getAll route since it's an MVP and find it.
      const subs = await adminService.getSubmissions();
      const found = subs.find(s => s.id === params.id);
      if (found) {
        setSubmission(found);
      } else {
        setError("Submission not found");
      }
    } catch (err: any) {
      setError("Failed to load submission");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmission();
  }, [params.id]);

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    try {
      setIsSubmitting(true);
      await adminService.makeDecision(submission.id, decision);
      await loadSubmission();
    } catch (err: any) {
      setError(err.message || "Failed to save decision");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!submission || !volumeId) return;
    try {
      setIsSubmitting(true);
      await adminService.publishArticle(submission.id, volumeId);
      await loadSubmission();
    } catch (err: any) {
      setError(err.message || "Failed to publish article");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-zinc-500">Loading...</div>;
  if (error || !submission) return <div className="text-center py-12 text-red-500">{error}</div>;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  // We added a static /uploads route in express that sits at http://localhost:3001/uploads
  const baseUrl = apiUrl.replace('/api', '');
  const downloadLink = submission.pdfUrl ? `${baseUrl}${submission.pdfUrl}` : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <button onClick={() => router.push("/admin/submissions")} className="text-sm text-blue-600 hover:underline mb-2 block">
            &larr; Back to List
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {submission.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Status: <span className="font-semibold text-zinc-900 dark:text-white">{submission.status}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Abstract</h2>
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{submission.abstract}</p>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Manuscript File</h2>
          {downloadLink ? (
            <a 
              href={downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Download PDF
            </a>
          ) : (
            <p className="text-zinc-500 italic">No PDF found</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Decision Form */}
        <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Editorial Decision</h2>
          <form onSubmit={handleDecision} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Decision
              </label>
              <select
                value={decision}
                onChange={(e: any) => setDecision(e.target.value)}
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              >
                <option value="REVISIONS_REQUIRED">Request Revisions</option>
                <option value="ACCEPTED">Accept Submission</option>
                <option value="REJECTED">Reject Submission</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || submission.status === 'PUBLISHED'}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Save Decision
            </button>
          </form>
        </div>

        {/* Publish Action (Visible if ACCEPTED) */}
        {submission.status === "ACCEPTED" && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-4">Publish Article</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Assign to Volume (UUID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
                  value={volumeId}
                  onChange={(e) => setVolumeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-emerald-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100 placeholder:text-emerald-600/50"
                />
              </div>
              <button
                onClick={handlePublish}
                disabled={isSubmitting || !volumeId}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                Publish Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
