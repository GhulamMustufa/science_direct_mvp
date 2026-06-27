import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden py-20">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]" />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
      </div>

      <div className="container max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
          Discover{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Peer-Reviewed
          </span>{" "}
          Science
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Access thousands of academic papers, sync OJS publications instantly, and organize your read list using our integrated curation workspace.
        </p>

        {/* Mock Search input container */}
        <div className="mx-auto mt-10 max-w-2xl">
          <form className="relative flex items-center" action="/search" method="GET">
            <input
              type="text"
              name="query"
              placeholder="Search by title, abstract, DOI or keywords..."
              className="h-14 w-full rounded-full border border-zinc-200 bg-white/90 pl-6 pr-32 text-sm shadow-lg backdrop-blur focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-black/90 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Feature quick links */}
        <div className="mt-8 flex justify-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>Popular:</span>
          <Link href="/search?query=Deep+Learning" className="underline hover:text-zinc-950 dark:hover:text-zinc-100">
            Deep Learning
          </Link>
          <span>•</span>
          <Link href="/search?query=Genomics" className="underline hover:text-zinc-950 dark:hover:text-zinc-100">
            Genomics
          </Link>
        </div>
      </div>
    </div>
  );
}
