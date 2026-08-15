"use client";

import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function SecurityTipsCard() {
  const tips = [
    "Enable Two-Factor Authentication",
    "Use a strong password",
    "Do not share your account details",
    "Log out from unknown devices",
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Security Tips</h3>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span className="text-xs text-muted-2 leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
