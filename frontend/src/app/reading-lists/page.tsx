"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useReadingLists } from "@/features/reading-lists/hooks/useReadingLists";
import { FormField } from "@/features/auth/components/FormField";
import { Button } from "@/components/ui/button";
import { ReadingList } from "@/types";
import { ArticleListSkeleton } from "@/components/ui/Loading";

function CreateListForm({ onCreate }: { onCreate: (name: string, desc?: string) => Promise<void> }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onCreate(name, desc);
      setName("");
      setDesc("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-xl border border-zinc-200 bg-white space-y-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Create New List</h3>
      <FormField id="listName" label="List Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <FormField id="listDesc" label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <Button type="submit" disabled={submitting || !name.trim()} className="w-full text-xs font-semibold h-10 bg-blue-600 hover:bg-blue-700 text-white">
        {submitting ? "Creating..." : "Create List"}
      </Button>
    </form>
  );
}

function ReadingListCard({ list, onDelete }: { list: ReadingList; onDelete: (id: string) => void }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 hover:shadow-md transition-shadow">
      <div>
        <Link href={`/reading-lists/${list.id}`}>
          <h3 className="text-lg font-bold text-zinc-900 hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400 transition-colors">
            {list.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {list.description || "No description provided."}
        </p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onDelete(list.id)} className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
        Delete
      </Button>
    </div>
  );
}

export default function ReadingListsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lists, loading, createList, deleteList } = useReadingLists();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
      <div className="border-b border-zinc-200 pb-6 mb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your Reading Lists
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage your custom curation folders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {authLoading || loading ? (
            <ArticleListSkeleton count={2} />
          ) : lists.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-zinc-200 rounded-xl dark:border-zinc-800 text-zinc-500">
              No reading lists created yet.
            </div>
          ) : (
            lists.map((list) => (
              <ReadingListCard key={list.id} list={list} onDelete={deleteList} />
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <CreateListForm onCreate={createList} />
        </div>
      </div>
    </div>
  );
}
