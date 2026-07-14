"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService } from "@/features/author/services/author.service";
import { CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Send, Clock, FileText } from "lucide-react";
import { FormPageSkeleton } from "@/components/ui/Loading";

interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  category: string;
}

interface CategoryResult {
  score: number;
  passed: string[];
  issues: ValidationIssue[];
}

interface ValidationReport {
  isValid: boolean;
  score: number;
  passed: Array<{ name: string; category: string }>;
  warnings: ValidationIssue[];
  errors: ValidationIssue[];
  executionTimeMs: number;
  categories: {
    [category: string]: CategoryResult;
  };
}

export default function SubmissionValidationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [formDataState, setFormDataState] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Metadata");

  useEffect(() => {
    const reportStr = sessionStorage.getItem("lastValidationReport");
    const formDataStr = sessionStorage.getItem("lastValidationFormData");
    const name = sessionStorage.getItem("lastValidationFileName");

    if (reportStr && formDataStr) {
      setReport(JSON.parse(reportStr));
      setFormDataState(JSON.parse(formDataStr));
      setFileName(name || "Manuscript Document");
    } else {
      router.push("/author/submit");
    }
  }, [router]);

  if (authLoading) return <FormPageSkeleton />;
  if (!user) {
    router.push("/login");
    return null;
  }

  if (!report) {
    return <FormPageSkeleton />;
  }

  const getFileFromIndexedDB = async (): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SubmissionDB', 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files');
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readonly');
        const store = tx.objectStore('files');
        const getReq = store.get('draftFile');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => reject(getReq.error);
      };
      request.onerror = () => reject(request.error);
    });
  };

  const handleFinalSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const file = await getFileFromIndexedDB();
      if (!file) {
        throw new Error("Manuscript file not found in local cache. Please re-upload.");
      }

      const formData = new FormData();
      if (formDataState.journalId) {
        formData.append("journalId", formDataState.journalId);
      }
      formData.append("section", formDataState.section);
      formData.append("language", formDataState.language);
      formData.append("authors", JSON.stringify(formDataState.authors));
      formData.append("pdf", file);

      await authorService.submitArticle(formData);

      // Clean up session cache
      sessionStorage.removeItem("lastValidationReport");
      sessionStorage.removeItem("lastValidationFormData");
      sessionStorage.removeItem("lastValidationFileName");

      // Clean up IndexedDB
      const request = indexedDB.open('SubmissionDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('files', 'readwrite');
        tx.objectStore('files').delete('draftFile');
      };

      router.push("/author");
    } catch (err: any) {
      setError(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
    if (score >= 70) return "text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/20";
    return "text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/20";
  };

  const getGrade = (score: number) => {
    if (score >= 90) return "Excellent (Ready)";
    if (score >= 75) return "Good (Review Warnings)";
    if (score >= 50) return "Needs Revision";
    return "Poor Structure";
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <button
        onClick={() => router.push("/author/submit")}
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Submission Form
      </button>

      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Manuscript Validation Report
          </h1>
          <p className="mt-2 text-sm text-zinc-500 flex items-center gap-1.5">
            <FileText size={16} className="text-zinc-400" />
            {fileName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full w-fit">
          <Clock size={16} className="text-zinc-400" />
          Validated in <span className="font-semibold">{report.executionTimeMs.toFixed(1)}ms</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Score & Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreColor(report.score)}`}>
          <span className="text-sm font-medium tracking-wide uppercase text-zinc-500">Overall Score</span>
          <span className="text-5xl font-black my-2">{report.score}</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-white dark:bg-zinc-900 shadow-sm border border-current">
            {getGrade(report.score)}
          </span>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col justify-center border-r border-zinc-100 dark:border-zinc-800">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{report.passed.length}</span>
            <span className="text-xs text-zinc-500 mt-1">Checks Passed</span>
          </div>
          <div className="flex flex-col justify-center border-r border-zinc-100 dark:border-zinc-800">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{report.warnings.length}</span>
            <span className="text-xs text-zinc-500 mt-1">Warnings</span>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{report.errors.length}</span>
            <span className="text-xs text-zinc-500 mt-1">Blocking Errors</span>
          </div>
        </div>
      </div>

      {/* Category Explorer */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex">
          {Object.keys(report.categories).map((catName) => {
            const cat = report.categories[catName];
            const issueCount = cat.issues.length;
            const hasErrors = cat.issues.some(i => i.severity === 'error');
            
            return (
              <button
                key={catName}
                onClick={() => setActiveTab(catName)}
                className={`flex-1 py-3 px-4 text-center text-sm font-medium border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === catName
                    ? "border-blue-600 text-blue-600 bg-white dark:bg-zinc-900 dark:border-blue-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                {catName}
                {issueCount > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-2xs font-bold text-white ${
                    hasErrors ? "bg-rose-500" : "bg-amber-500"
                  }`}>
                    {issueCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-6 space-y-6">
          {/* Active Category Result Panel */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Category Compliance Score: <span className="font-extrabold">{report.categories[activeTab]?.score}/100</span>
              </h3>
            </div>

            <div className="space-y-4">
              {/* Errors in current Category */}
              {report.categories[activeTab]?.issues
                .filter(i => i.severity === 'error')
                .map((err, idx) => (
                  <div key={`err-${idx}`} className="flex gap-3 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 text-sm">
                    <XCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="capitalize">{err.field}:</strong> {err.message}
                    </div>
                  </div>
                ))}

              {/* Warnings in current Category */}
              {report.categories[activeTab]?.issues
                .filter(i => i.severity === 'warning')
                .map((warn, idx) => (
                  <div key={`warn-${idx}`} className="flex gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-sm">
                    <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <strong className="capitalize">{warn.field}:</strong> {warn.message}
                    </div>
                  </div>
                ))}

              {/* Passed checks in current Category */}
              {report.categories[activeTab]?.passed.map((chk, idx) => (
                <div key={`passed-${idx}`} className="flex gap-3 p-3 rounded-lg bg-emerald-50/30 dark:bg-emerald-950/5 border border-emerald-100 dark:border-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-sm">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                  <div>{chk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-zinc-500 max-w-lg">
          {report.isValid ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Ready for submit. There are no blocking errors.
            </span>
          ) : (
            <span className="text-rose-600 dark:text-rose-400 font-semibold">
              ⚠ Cannot submit yet. Please resolve all validation errors in the manuscript first.
            </span>
          )}
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={() => router.push("/author/submit")}
            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 transition"
          >
            Edit Submission
          </button>
          
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting || !report.isValid}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                Confirm & Submit <Send size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
