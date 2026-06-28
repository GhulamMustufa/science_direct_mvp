"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authorService, AuthorDashboardResponse } from "@/features/author/services/author.service";

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

function PublicationsTable({ publications }: { publications: any[] }) {
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

  if (authLoading || loading || !data) {
    return <div className="container mx-auto px-4 py-12 text-center text-zinc-500">Loading Dashboard...</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 space-y-8">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Author Dashboard
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Monitor views and download metrics across your linked publications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <MetricCard title="Publications" value={data.publications.length} />
        <MetricCard title="Total Views" value={data.totalViews} />
        <MetricCard title="Total Downloads" value={data.totalDownloads} />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Linked Publications</h2>
        <PublicationsTable publications={data.publications} />
      </div>
    </div>
  );
}
