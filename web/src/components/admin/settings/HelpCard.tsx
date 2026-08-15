"use client";

import { Headphones, ArrowRight } from "lucide-react";

export function HelpCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 ring-1 ring-sky-400/25">
          <Headphones className="h-5 w-5 text-sky-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Need help?</h3>
      </div>

      <p className="text-xs text-muted-2 leading-relaxed mb-5">
        If you need assistance, our support team is here to help you.
      </p>

      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card-elevated px-4 py-3 text-xs font-medium text-white hover:border-purple-bright/40 hover:bg-purple/5 transition cursor-pointer group"
      >
        Open Support Ticket
        <ArrowRight className="h-4 w-4 text-muted-2 group-hover:text-purple-bright group-hover:translate-x-0.5 transition" />
      </button>
    </div>
  );
}
