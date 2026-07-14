"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService, SubmissionResponse } from "@/features/author/services/author.service";
import { submissionValidator } from '@/features/author/validation/SubmissionValidator';

export default function SubmissionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [submission, setSubmission] = useState<SubmissionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    
    const fetchSubmission = async () => {
      try {
        const subs = await authorService.getMySubmissions();
        const found = subs.find(s => s.id === params.id);
        if (found) {
          setSubmission(found);
        } else {
          setError("Submission not found");
        }
      } catch (err: any) {
        setError("Error loading submission details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmission();
  }, [user, authLoading, params.id, router]);

  const handleRevisionUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    const validationResult = submissionValidator.validateRevision({ file: pdfFile });
    if (!validationResult.isValid) {
      alert(validationResult.errors.map(err => err.message).join('\n'));
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("pdf", pdfFile!);
      
      const updated = await authorService.uploadRevision(submission.id, formData);
      setSubmission(updated);
      setPdfFile(null);
      
      // Optionally show a success toast here
    } catch (err: any) {
      setError(err.message || "Failed to upload revision");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="container mx-auto p-12 text-center text-zinc-500">Loading submission...</div>;
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto p-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.push("/author")} className="text-blue-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isRevisionsRequired = submission.status === "REVISIONS_REQUIRED";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <button onClick={() => router.push("/author")} className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Dashboard
        </button>
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {submission.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Submitted on {new Date(submission.createdAt || submission.submittedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
              {submission.status}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Abstract</h2>
        <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {submission.abstract || "No abstract provided."}
        </p>
      </div>

      {isRevisionsRequired && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-amber-900 dark:text-amber-500 mb-2">Revisions Required</h2>
          <p className="text-amber-800 dark:text-amber-600 text-sm mb-4">
            The editorial team has requested revisions for your manuscript. Please upload the updated PDF below.
          </p>
          
          <form onSubmit={handleRevisionUpload} className="space-y-4">
            <div>
              <input
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                required
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-amber-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 dark:file:bg-amber-900 dark:file:text-amber-200"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !pdfFile}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Revision"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
