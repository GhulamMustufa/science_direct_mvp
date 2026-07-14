"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminService } from "@/features/admin/services/admin.service";
import { SubmissionResponse } from "@/features/author/services/author.service";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("SUBMITTED");

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSubmissions(filter === "ALL" ? undefined : filter);
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Editorial Submissions
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Review submitted manuscripts and make publication decisions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full rounded-md border-zinc-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="SUBMITTED">Pending (SUBMITTED)</option>
            <option value="REVISIONS_REQUIRED">Revisions Required</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
            <option value="PUBLISHED">Published</option>
            <option value="ALL">All Submissions</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading...</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500">
          No submissions found for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/30">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-transparent">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/10">
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100 max-w-sm truncate">
                    {sub.title}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-zinc-500">
                    {new Date(sub.updatedAt || sub.createdAt || Date.now()).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/submissions/${sub.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Review
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
