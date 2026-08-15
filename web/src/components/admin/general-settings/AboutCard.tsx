"use client";

import { Hexagon } from "lucide-react";

export function AboutCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 ring-1 ring-purple-bright/30">
          <Hexagon className="h-5 w-5 text-purple-bright" />
        </div>
        <h3 className="text-sm font-semibold text-white">About EZTRADE</h3>
      </div>

      {/* Details */}
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted">Version</span>
          <span className="font-mono font-medium text-white">1.0.0</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Platform Status</span>
          <span className="rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success ring-1 ring-success/20">
            All Systems Operational
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Member Since</span>
          <span className="font-medium text-white">May 10, 2024</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Last Login</span>
          <span className="font-medium text-white">May 18, 2024 10:45 AM</span>
        </div>
      </div>
    </div>
  );
}
