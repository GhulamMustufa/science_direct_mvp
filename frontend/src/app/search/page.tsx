import { Suspense } from "react";
import { SearchDashboard } from "@/features/search/components/SearchDashboard";
import { SearchSkeleton } from "@/components/ui/Loading";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchDashboard />
    </Suspense>
  );
}
