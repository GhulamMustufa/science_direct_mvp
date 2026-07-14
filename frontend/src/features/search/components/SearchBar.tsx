"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [inputValue, setInputValue] = useState(query);
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedValue === query) return;

    if (debouncedValue) {
      params.set("query", debouncedValue);
    } else {
      params.delete("query");
    }
    params.set("page", "1"); // Reset pagination on new search
    router.push(`/search?${params.toString()}`);
  }, [debouncedValue, query, router]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search by title, abstract, DOI, keywords..."
        className="h-12 w-full rounded-lg border border-zinc-200 bg-white pl-5 pr-10 text-sm shadow-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {inputValue && (
        <button
          onClick={() => setInputValue("")}
          className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs font-semibold"
        >
          Clear
        </button>
      )}
    </div>
  );
}
