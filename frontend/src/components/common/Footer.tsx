import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50 py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              ScienceDirect MVP
            </span>
            <span className="text-xs text-zinc-500">
              © {new Date().getFullYear()} ScienceDirect MVP. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
