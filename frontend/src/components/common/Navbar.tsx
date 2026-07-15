"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  
  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
      isActive(path) 
        ? "text-emerald-600 dark:text-emerald-400" 
        : "text-zinc-600 dark:text-zinc-400"
    }`;

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />;
  }

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className={linkClass("/")}>Home</Link>
      <Link href="/about" className={linkClass("/about")}>About Us</Link>
      <Link href="/members" className={linkClass("/members")}>Members</Link>
      <Link href="/journals" className={linkClass("/journals")}>Journals</Link>
      <Link href="/search" className={linkClass("/search")}>Search</Link>

      {user ? (
        <>
          <Link href="/bookmarks" className={linkClass("/bookmarks")}>Bookmarks</Link>
          {["author", "editor", "admin"].includes(user.role) && (
            <Link href="/author" className={linkClass("/author")}>Dashboard</Link>
          )}
          {user.role === "admin" && (
            <Link href="/admin" className={linkClass("/admin")}>Admin</Link>
          )}
          
          <div className="flex items-center gap-4 border-l border-zinc-200 pl-4 dark:border-zinc-800">
            <Link href="/profile" className="text-xs font-semibold text-zinc-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400">
              {user.firstName || user.email}
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="h-8 text-xs hover:text-red-600 dark:hover:text-red-400">
              Sign Out
            </Button>
          </div>
        </>
      ) : (
        <Link href="/login">
          <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-emerald-600 hover:from-emerald-700 hover:to-emerald-700 text-white rounded-full">
            Sign In
          </Button>
        </Link>
      )}
    </nav>
  );
}
