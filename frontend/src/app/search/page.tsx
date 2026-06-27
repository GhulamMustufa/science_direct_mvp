import { Suspense } from "react";
import { SearchDashboard } from "@/features/search/components/SearchDashboard";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center text-zinc-500">
        Loading Search Interface...
      </div>
    }>
      <SearchDashboard />
    </Suspense>
  );
}
