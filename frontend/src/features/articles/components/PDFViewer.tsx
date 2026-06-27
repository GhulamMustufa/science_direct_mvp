interface PDFViewerProps {
  pdfUrl?: string | null;
}

export function PDFViewer({ pdfUrl }: PDFViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
        No PDF document is available for this article.
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mb-2 flex items-center justify-between px-2 text-xs font-semibold text-zinc-500">
        <span>Embedded Document Reader</span>
        <span>Interactive Frame</span>
      </div>
      <iframe
        src={pdfUrl}
        title="PDF Reader"
        className="h-[650px] w-full rounded-lg border border-zinc-100 dark:border-zinc-800"
      />
    </div>
  );
}
