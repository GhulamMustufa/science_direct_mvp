import React from "react";

export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-zinc-200 border-t-emerald-600 dark:border-zinc-800 dark:border-t-emerald-500`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 animate-pulse">
      <div className="flex items-center space-x-2 mb-3">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex space-x-2">
          <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function ArticleListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-zinc-200 dark:border-zinc-800">
      <td className="py-4 px-6">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="py-4 px-6">
        <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="py-4 px-6">
        <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="py-4 px-6 text-right">
        <div className="h-8 w-20 inline-block rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
    </tr>
  );
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <th className="py-3 px-6 h-10 w-24 bg-zinc-100 dark:bg-zinc-900/80 animate-pulse" />
            <th className="py-3 px-6 h-10 w-36 bg-zinc-100 dark:bg-zinc-900/80 animate-pulse" />
            <th className="py-3 px-6 h-10 w-16 bg-zinc-100 dark:bg-zinc-900/80 animate-pulse" />
            <th className="py-3 px-6 h-10 w-20 bg-zinc-100 dark:bg-zinc-900/80 animate-pulse" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
            <div className="h-8 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      {/* Main content split */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <div className="h-6 w-36 rounded bg-zinc-200 dark:bg-zinc-800 mb-4" />
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 animate-pulse space-y-8">
      <div>
        <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
        <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-48 w-full bg-zinc-200 dark:bg-zinc-900/50 rounded-xl" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded mb-4" />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function SubmissionDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-6" />
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
        <div className="flex-1 space-y-3 pr-8">
          <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-7 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0" />
      </div>
      {/* Abstract card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 mb-6 space-y-3">
        <div className="h-5 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      {/* Action card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 space-y-4">
        <div className="h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-48 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-80 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
      {/* Form card */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-8 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-28 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-40 w-full rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-10 w-32 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-24 rounded-md bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}

