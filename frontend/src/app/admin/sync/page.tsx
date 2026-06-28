"use client";

import { useEffect, useState, useCallback } from "react";
import { adminService, SyncJobResponse } from "@/features/admin/services/admin.service";
import { Button } from "@/components/ui/button";

function SyncStatusPanel({ job }: { job: SyncJobResponse }) {
  const getBadgeStyle = (status: string) => {
    if (status === "completed") return "bg-green-50 text-green-705 border-green-200 dark:bg-green-950/20 dark:text-green-400";
    if (status === "failed") return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400";
    if (status === "running") return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 animate-pulse";
    return "bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400";
  };

  return (
    <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 space-y-4">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-between">
        <span>Synchronization Logs</span>
        <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${getBadgeStyle(job.status)}`}>
          {job.status}
        </span>
      </h3>
      <div className="text-xs space-y-2 text-zinc-500 dark:text-zinc-400">
        <p><strong>Job ID:</strong> {job.id}</p>
        <p><strong>Started:</strong> {new Date(job.startedAt).toLocaleString()}</p>
        {job.completedAt && <p><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()}</p>}
        <p><strong>Progress:</strong> <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{job.progress || "Queued..."}</span></p>
        {job.error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg font-mono text-[10px] mt-2 border border-red-150 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900">
            {job.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OjsSyncPage() {
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [job, setJob] = useState<SyncJobResponse | null>(null);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    const savedJobId = localStorage.getItem("active_sync_job_id");
    if (savedJobId) setActiveJobId(savedJobId);
  }, []);

  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const status = await adminService.getSyncStatus(jobId);
      setJob(status);
      if (status.status === "completed" || status.status === "failed") {
        setActiveJobId(null);
        localStorage.removeItem("active_sync_job_id");
      }
    } catch {
      setActiveJobId(null);
      localStorage.removeItem("active_sync_job_id");
    }
  }, []);

  useEffect(() => {
    if (!activeJobId) return;
    pollJobStatus(activeJobId);
    const interval = setInterval(() => pollJobStatus(activeJobId), 2000);
    return () => clearInterval(interval);
  }, [activeJobId, pollJobStatus]);

  const handleTriggerSync = async () => {
    setTriggering(true);
    try {
      const res = await adminService.triggerSync();
      setActiveJobId(res.jobId);
      localStorage.setItem("active_sync_job_id", res.jobId);
      setJob({ id: res.jobId, status: "pending", startedAt: new Date().toISOString(), progress: "Queued..." });
    } catch (err) {
      console.error(err);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">OJS Sync Control</h1>
          <p className="mt-2 text-sm text-zinc-500">Synchronize publication resources from the external Open Journal System.</p>
        </div>
        <Button onClick={handleTriggerSync} disabled={triggering || !!activeJobId} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-6 h-11 font-semibold shadow transition-all">
          {triggering ? "Triggering..." : activeJobId ? "Sync Running" : "Trigger Manual Sync"}
        </Button>
      </div>
      {job && <SyncStatusPanel job={job} />}
    </div>
  );
}
