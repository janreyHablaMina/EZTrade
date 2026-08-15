"use client";

import { UserCircle2 } from "lucide-react";

const SUMMARY_ITEMS = [
  { label: "Account ID", value: "EZT-984512", mono: true },
  { label: "Membership", value: "VIP 3", badge: true },
  { label: "Member Since", value: "May 10, 2024" },
  { label: "Last Login", value: "May 18, 2024 10:45 AM" },
  { label: "Account Status", value: "Active", status: true },
];

export function AccountSummaryCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple/20 ring-1 ring-purple-bright/30">
          <UserCircle2 className="h-5 w-5 text-purple-bright" />
        </div>
        <h3 className="text-sm font-semibold text-white">Account Summary</h3>
      </div>

      {/* Items */}
      <div className="space-y-3.5">
        {SUMMARY_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-muted">{item.label}</span>
            {item.badge ? (
              <span className="rounded-md bg-purple/25 px-2 py-0.5 text-[11px] font-bold text-purple-bright ring-1 ring-purple-bright/30">
                {item.value}
              </span>
            ) : item.status ? (
              <span className="rounded-md bg-success/15 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                {item.value}
              </span>
            ) : (
              <span className={`text-white font-medium ${item.mono ? "font-mono tracking-wide" : ""}`}>
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
