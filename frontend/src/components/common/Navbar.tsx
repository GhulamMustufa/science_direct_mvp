"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  
  const linkClass = (path: string) => 
    `text-sm font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
      isActive(path) 
        ? "text-emerald-600 dark:text-emerald-400" 
        : "text-zinc-600 dark:text-zinc-400"
    }`;

  const mobileLinkClass = (path: string) =>
    `block py-3 text-base font-medium transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 border-b border-zinc-100 dark:border-zinc-800 ${
      isActive(path) 
        ? "text-emerald-600 dark:text-emerald-400" 
        : "text-zinc-600 dark:text-zinc-400"
    }`;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-[72px] left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 shadow-lg md:hidden z-50 flex flex-col max-h-[calc(100vh-72px)] overflow-y-auto">
          <Link href="/" onClick={closeMobileMenu} className={mobileLinkClass("/")}>Home</Link>
          <Link href="/about" onClick={closeMobileMenu} className={mobileLinkClass("/about")}>About Us</Link>
          <Link href="/members" onClick={closeMobileMenu} className={mobileLinkClass("/members")}>Members</Link>
          <Link href="/journals" onClick={closeMobileMenu} className={mobileLinkClass("/journals")}>Journals</Link>
          <Link href="/search" onClick={closeMobileMenu} className={mobileLinkClass("/search")}>Search</Link>

          {user ? (
            <>
              <Link href="/bookmarks" onClick={closeMobileMenu} className={mobileLinkClass("/bookmarks")}>Bookmarks</Link>
              {["author", "editor", "admin"].includes(user.role) && (
                <Link href="/author" onClick={closeMobileMenu} className={mobileLinkClass("/author")}>Dashboard</Link>
              )}
              {user.role === "admin" && (
                <Link href="/admin" onClick={closeMobileMenu} className={mobileLinkClass("/admin")}>Admin</Link>
              )}
              
              <div className="pt-4 mt-2 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <Link href="/profile" onClick={closeMobileMenu} className="font-semibold text-zinc-900 dark:text-zinc-100 block hover:text-emerald-600">
                      {user.firstName || 'User Profile'}
                    </Link>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => { logout(); closeMobileMenu(); }}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-4 pb-2">
              <Link href="/login" onClick={closeMobileMenu}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
