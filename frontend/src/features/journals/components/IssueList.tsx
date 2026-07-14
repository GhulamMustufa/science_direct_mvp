import Link from "next/link";
import { Volume, Issue } from "@/types";

export function IssueList({
  volumes,
  issues,
  journalId,
}: {
  volumes: Volume[];
  issues: Issue[];
  journalId: string;
}) {
  // Sort volumes by volumeNumber descending
  const sortedVolumes = [...volumes].sort(
    (a, b) => parseFloat(b.volumeNumber) - parseFloat(a.volumeNumber)
  );

  return (
    <div className="space-y-8">
      {sortedVolumes.map((volume) => {
        const volumeIssues = issues
          .filter((i) => i.volumeId === volume.id)
          .sort((a, b) => parseFloat(b.issueNumber) - parseFloat(a.issueNumber));

        return (
          <div key={volume.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 pb-2 mb-4 dark:border-zinc-800">
              Volume {volume.volumeNumber} ({volume.year})
            </h3>
            {volumeIssues.length === 0 ? (
              <p className="text-sm text-zinc-500">No issues available in this volume.</p>
            ) : (
              <ul className="space-y-3">
                {volumeIssues.map((issue) => (
                  <li key={issue.id} className="flex items-center">
                    <Link
                      href={`/journals/${journalId}/issues/${issue.id}`}
                      className="text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Issue {issue.issueNumber} {issue.title ? `— ${issue.title}` : ""}
                    </Link>
                    <span className="text-xs text-zinc-400 ml-2">({issue.year})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
