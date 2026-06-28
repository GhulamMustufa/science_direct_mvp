import Link from "next/link";
import { Button } from "@/components/ui/button";

function PanelCard({ title, desc, href, actionText }: { title: string; desc: string; href: string; actionText: string }) {
  return (
    <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-between h-48">
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-2 text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">{desc}</p>
      </div>
      <Link href={href} className="mt-4">
        <Button size="sm" className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
          {actionText}
        </Button>
      </Link>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin Overview
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Configure users, check background services, and trigger imports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <PanelCard
          title="User Management"
          desc="Promote readers to author or editor. Change system roles to adjust access rights dynamically."
          href="/admin/users"
          actionText="Manage Users"
        />
        <PanelCard
          title="OJS Synchronization"
          desc="Trigger a manual import of journals, volumes, issues, and articles from the OJS REST API database."
          href="/admin/sync"
          actionText="Sync Control"
        />
      </div>
    </div>
  );
}
