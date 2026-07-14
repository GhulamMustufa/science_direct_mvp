"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/features/admin/services/admin.service";
import { journalsService } from "@/features/journals/services/journals.service";
import { SubmissionResponse } from "@/features/author/services/author.service";
import { SubmissionDetailSkeleton } from "@/components/ui/Loading";

export default function AdminSubmissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  
  const [submission, setSubmission] = useState<SubmissionResponse & { pdfUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [decision, setDecision] = useState<'ACCEPTED' | 'REJECTED' | 'REVISIONS_REQUIRED'>('REVISIONS_REQUIRED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Volume selection/creation states
  const [journals, setJournals] = useState<any[]>([]);
  const [selectedJournalId, setSelectedJournalId] = useState<string>("");
  const [volumesList, setVolumesList] = useState<any[]>([]);
  const [selectedVolumeId, setSelectedVolumeId] = useState<string>("NEW_VOLUME");
  const [newVolumeNumber, setNewVolumeNumber] = useState("");
  const [newVolumeYear, setNewVolumeYear] = useState("");
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadSubmission = async () => {
    try {
      const subs = await adminService.getSubmissions();
      const found = subs.find(s => s.id === params.id);
      if (found) {
        setSubmission(found);
        return found;
      } else {
        setError("Submission not found");
      }
    } catch (err: any) {
      setError("Failed to load submission");
    } finally {
      setLoading(false);
    }
    return null;
  };

  const loadJournals = async (sub: any) => {
    try {
      const list = await journalsService.getJournals();
      setJournals(list);
      
      const targetJournalId = sub.journalId || (list.length > 0 ? list[0].id : null);
      
      if (targetJournalId) {
        setSelectedJournalId(targetJournalId);
        const details = await journalsService.getJournalDetail(targetJournalId);
        setVolumesList(details.volumes || []);
        if (details.volumes && details.volumes.length > 0) {
          setSelectedVolumeId(details.volumes[0].id);
        } else {
          setSelectedVolumeId("NEW_VOLUME");
        }
      }
    } catch (err) {
      console.error("Failed to load journals/volumes", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const sub = await loadSubmission();
      if (sub) {
        await loadJournals(sub);
      }
    };
    init();
  }, [params.id]);

  const handleJournalChange = async (journalId: string) => {
    setSelectedJournalId(journalId);
    try {
      const details = await journalsService.getJournalDetail(journalId);
      setVolumesList(details.volumes || []);
      if (details.volumes && details.volumes.length > 0) {
        setSelectedVolumeId(details.volumes[0].id);
      } else {
        setSelectedVolumeId("NEW_VOLUME");
      }
    } catch (err) {
      console.error("Failed to load volumes for journal", err);
    }
  };

  const handleDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    try {
      setIsSubmitting(true);
      await adminService.makeDecision(submission.id, decision);
      triggerToast(`Decision "${decision}" saved successfully!`, 'success');
      if (decision === 'ACCEPTED') {
        const updatedSub = await loadSubmission();
        if (updatedSub) await loadJournals(updatedSub);
      } else {
        setTimeout(() => {
          router.push('/admin/submissions');
        }, 1500);
      }
    } catch (err: any) {
      triggerToast(err.message || "Failed to save decision", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!submission) return;
    try {
      setIsSubmitting(true);
      if (selectedVolumeId === "NEW_VOLUME") {
        if (!newVolumeNumber || !newVolumeYear || !selectedJournalId) {
          triggerToast("Please enter volume number, year, and select a journal", "error");
          return;
        }
        await adminService.publishArticle(submission.id, {
          journalId: selectedJournalId,
          volumeNumber: newVolumeNumber,
          year: newVolumeYear
        });
      } else {
        await adminService.publishArticle(submission.id, {
          volumeId: selectedVolumeId
        });
      }
      triggerToast("Article published successfully!", 'success');
      setTimeout(() => {
        router.push('/admin/submissions');
      }, 1500);
    } catch (err: any) {
      triggerToast(err.message || "Failed to publish article", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <SubmissionDetailSkeleton />;
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
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Choose Action
              </label>
              <select
                value={decision}
                onChange={(e: any) => setDecision(e.target.value)}
                className="mt-2 block w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white shadow-sm transition"
              >
                <option value="REVISIONS_REQUIRED">Request Revisions</option>
                <option value="ACCEPTED">Accept Submission</option>
                <option value="REJECTED">Reject Submission</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || submission.status === 'PUBLISHED' || submission.status === 'ACCEPTED'}
              className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-white bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
            >
              Save Decision
            </button>
          </form>
        </div>

        {/* Publish Action (Visible if ACCEPTED) */}
        {submission.status === "ACCEPTED" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 rounded-xl p-6">
            <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-400 mb-4">Publish Article</h2>
            <div className="space-y-4">


              {/* Select Volume */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Select Volume
                </label>
                <select
                  value={selectedVolumeId}
                  onChange={(e) => setSelectedVolumeId(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 dark:text-emerald-100 transition"
                >
                  {volumesList.map(v => (
                    <option key={v.id} value={v.id}>Volume {v.volumeNumber} ({v.year})</option>
                  ))}
                  <option value="NEW_VOLUME">+ Create New Volume</option>
                </select>
              </div>

              {/* New Volume Fields */}
              {selectedVolumeId === "NEW_VOLUME" && (
                <div className="mt-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Volume Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11"
                      value={newVolumeNumber}
                      onChange={(e) => setNewVolumeNumber(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 dark:text-emerald-100 placeholder:text-emerald-600/30 dark:placeholder:text-emerald-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Year
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2026"
                      value={newVolumeYear}
                      onChange={(e) => setNewVolumeYear(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm focus:border-emerald-500 focus:ring-emerald-500 dark:text-emerald-100 placeholder:text-emerald-600/30 dark:placeholder:text-emerald-500/20 transition"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handlePublish}
                disabled={isSubmitting || (selectedVolumeId === "NEW_VOLUME" && (!newVolumeNumber || !newVolumeYear))}
                className="w-full mt-4 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition"
              >
                Publish Now
              </button>
            </div>
          </div>
        )}

        {/* Published summary banner */}
        {submission.status === "PUBLISHED" && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-blue-950 dark:text-blue-400 mb-2">Publication Confirmed</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                This manuscript has been successfully published to the platform and is fully indexable.
              </p>
            </div>
            <div className="mt-4 text-xs space-y-1 text-zinc-700 dark:text-zinc-300 bg-white/40 dark:bg-zinc-950/40 p-3 rounded-lg border border-blue-100/50 dark:border-blue-950/50">
              <p><strong>Status:</strong> Published</p>
              <p className="truncate"><strong>Volume ID:</strong> {submission.volumeId}</p>
            </div>
          </div>
        )}

        {/* Informational Guidance card when pending/reviewing */}
        {submission.status !== "ACCEPTED" && submission.status !== "PUBLISHED" && (
          <div className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Editorial Guidelines</h3>
            <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-2 list-disc list-inside">
              <li>Review the manuscript Abstract and parsed figures/tables.</li>
              <li>Download the full PDF/DOCX file to verify equations and sections.</li>
              <li>Accept: Transitions status to ACCEPTED (enables publication tools).</li>
              <li>Revisions: Prompts author to upload an updated manuscript version.</li>
              <li>Reject: Formally denies publication of this manuscript.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-950 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-100 dark:border-emerald-900' 
            : 'bg-red-50 text-red-950 border-red-200 dark:bg-red-950/90 dark:text-red-100 dark:border-red-900'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
