"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-zinc-500">
        Authenticating admin session...
      </div>
    );
  }

  const links = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "User Management" },
    { href: "/admin/submissions", label: "Editorial Submissions" },
    { href: "/admin/journals", label: "Journal Management" },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-64 space-y-2 flex-shrink-0">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-3 mb-4">
          Admin Panel
        </h2>
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-950"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
