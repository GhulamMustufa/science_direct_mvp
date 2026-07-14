"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService } from "@/features/author/services/author.service";
import { submissionValidator } from '@/features/author/validation/SubmissionValidator';

export default function SubmitArticlePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [additionalAuthors, setAdditionalAuthors] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  
  const [checklist, setChecklist] = useState({
    originality: false,
    format: false,
    references: false,
    styling: false,
    ethics: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) return <div>Loading...</div>;
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleCheckboxChange = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = submissionValidator.validateSubmission({
      title,
      abstract,
      file: pdfFile,
      checklist,
    });

    if (!validationResult.isValid) {
      // Just grab the first error for simplicity to match previous behavior, 
      // or join them. We will join them with newlines.
      setError(validationResult.errors.map(err => err.message).join('\n'));
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("abstract", abstract);
      if (additionalAuthors) {
        formData.append("additionalAuthors", additionalAuthors);
      }
      formData.append("pdf", pdfFile!);

      await authorService.submitArticle(formData);
      router.push("/author"); // Redirect to dashboard
    } catch (err: any) {
      setError(err.message || "Failed to submit article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Submit New Article
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Provide your manuscript details, confirm you meet all academic requirements, and upload your manuscript (PDF or DOCX).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            1. Manuscript Details
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Article Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
              placeholder="Enter the full title of your article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Additional Authors <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={additionalAuthors}
              onChange={(e) => setAdditionalAuthors(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
              placeholder="e.g. John Doe (University of Oxford), Jane Smith (MIT)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Abstract
            </label>
            <textarea
              required
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:text-sm"
              placeholder="Provide a structured abstract of your manuscript (minimum 10 words)"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            2. Submission Checklist & Rules
          </h2>
          <p className="text-xs text-zinc-500">
            Please read and check all requirements below to confirm compliance:
          </p>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.originality}
                onChange={() => handleCheckboxChange("originality")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Originality:</strong> The submission has not been previously published, nor is it before another journal for consideration.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.format}
                onChange={() => handleCheckboxChange("format")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>File Format:</strong> The submission file is in PDF or Word Document (DOCX) file format.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.references}
                onChange={() => handleCheckboxChange("references")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>References:</strong> Where available, URLs or DOIs for the references have been provided.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.styling}
                onChange={() => handleCheckboxChange("styling")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Style & Layout:</strong> The text is double-spaced; uses a 12-point font; employs italics rather than underlining; and all illustrations, figures, and tables are placed within the text.
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={checklist.ethics}
                onChange={() => handleCheckboxChange("ethics")}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Ethics & Disclosure:</strong> All authors have read and approved the submission, and declared any potential conflicts of interest.
              </span>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            3. Upload Manuscript
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Manuscript File (PDF or DOCX, max 10MB)
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              required
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !Object.values(checklist).every(Boolean)}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
