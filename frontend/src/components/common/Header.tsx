import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-400">
              ScienceDirect
            </span>
            <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
              MVP
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/journals" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Journals
            </Link>
            <Link href="/search" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
              Search
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
