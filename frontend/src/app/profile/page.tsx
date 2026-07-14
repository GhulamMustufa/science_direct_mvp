"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Profile</h1>
            <p className="mt-1 text-sm text-zinc-500">Manage your account details and settings.</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {user.firstName?.[0] || user.email[0].toUpperCase()}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">First Name</label>
              <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{user.firstName || "-"}</div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Last Name</label>
              <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{user.lastName || "-"}</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address</label>
            <div className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">{user.email}</div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">System Role</label>
            <div className="mt-1 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20">
              {user.role}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800 flex justify-end">
          <Button variant="destructive" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
