import Link from "next/link";
import { Navbar } from "./Navbar";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-emerald-400">
            ScienceDirect
          </span>
          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            MVP
          </span>
        </Link>
        <Navbar />
      </div>
    </header>
  );
}
