"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService, AuthorDashboardResponse, SubmissionResponse } from "@/features/author/services/author.service";
import { Article } from "@/types";
import { DashboardSkeleton } from "@/components/ui/Loading";

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
        {title}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function PublicationsTable({ publications }: { publications: Article[] }) {
  if (publications.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500 bg-white dark:bg-zinc-900/20">
        No published articles linked to your account.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-150 bg-zinc-50/70 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/30">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4 text-center">Views</th>
            <th className="px-6 py-4 text-center">Downloads</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {publications.map((pub) => (
            <tr key={pub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
              <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                <Link href={`/articles/${pub.id}`} className="hover:underline">
                  {pub.title}
                </Link>
              </td>
              <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">{pub.views}</td>
              <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">{pub.downloads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubmissionsTable({ submissions }: { submissions: SubmissionResponse[] }) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500 bg-white dark:bg-zinc-900/20">
        No active submissions. <Link href="/author/submit" className="text-emerald-600 hover:underline">Submit a new manuscript.</Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-250 dark:border-zinc-700">
            Submitted
          </span>
        );
      case "REVISIONS_REQUIRED":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/25 dark:text-amber-400 border border-amber-200 dark:border-amber-900 animate-pulse">
            Revisions Required
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-750 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900">
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900">
            Rejected
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
            Published
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-150 bg-zinc-50/70 text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:border-zinc-800 dark:bg-zinc-900/30">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-center">Submitted Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {submissions.map((sub) => {
            const dateVal = sub.createdAt || sub.submittedAt;
            const dateStr = dateVal ? new Date(dateVal).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }) : "Unknown Date";

            return (
              <tr key={sub.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10">
                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 max-w-sm truncate">
                  {sub.title}
                </td>
                <td className="px-6 py-4 text-center">{getStatusBadge(sub.status)}</td>
                <td className="px-6 py-4 text-center font-medium text-zinc-600 dark:text-zinc-400">{dateStr}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/author/submissions/${sub.id}`}
                    className="text-xs font-bold text-emerald-650 hover:underline dark:text-emerald-400"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AuthorDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AuthorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const hasAccess = ["author", "editor", "admin"].includes(user.role);
    if (!hasAccess) {
      router.push("/");
      return;
    }
    async function loadDashboard() {
      try {
        const res = await authorService.getAuthorDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user, authLoading, router]);

  const activeSubmissionsCount = data ? data.submissions.filter(
    (s) => s.status !== "PUBLISHED" && s.status !== "REJECTED"
  ).length : 0;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 space-y-8">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Author Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Monitor views, download metrics, and track your active manuscript submissions.
        </p>
      </div>

      {authLoading || loading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
            <MetricCard title="Publications" value={data.publications.length} />
            <MetricCard title="Active Submissions" value={activeSubmissionsCount} />
            <MetricCard title="Total Views" value={data.totalViews} />
            <MetricCard title="Total Downloads" value={data.totalDownloads} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Active Submissions</h2>
              {data.submissions.length > 0 && (
                <Link
                  href="/author/submit"
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
                >
                  <span className="hidden sm:inline">Submit New Manuscript</span>
                  <span className="sm:hidden">Submit</span>
                </Link>
              )}
            </div>
            <SubmissionsTable submissions={data.submissions} />
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Linked Publications</h2>
            <PublicationsTable publications={data.publications} />
          </div>
        </>
      )}
    </div>
  );
}
