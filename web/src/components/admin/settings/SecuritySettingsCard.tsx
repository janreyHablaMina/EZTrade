"use client";

import { ShieldCheck, Clock, Laptop2, Globe, ChevronRight } from "lucide-react";

const SECURITY_ITEMS = [
  {
    icon: ShieldCheck,
    label: "Two-Factor Authentication",
    sub: null,
    value: "Enabled",
    valueStyle: "text-success",
    badge: null,
  },
  {
    icon: Clock,
    label: "Login Activity",
    sub: "View recent login activity",
    value: null,
    valueStyle: null,
    badge: null,
  },
  {
    icon: Laptop2,
    label: "Trusted Devices",
    sub: "Manage your trusted devices",
    value: null,
    valueStyle: null,
    badge: "3",
  },
  {
    icon: Globe,
    label: "Active Sessions",
    sub: "Manage your active sessions",
    value: null,
    valueStyle: null,
    badge: "2",
  },
];

export function SecuritySettingsCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
        </div>
        <h3 className="text-sm font-semibold text-white">Security Settings</h3>
      </div>

      {/* Items */}
      <div className="space-y-1">
        {SECURITY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.04] cursor-pointer group"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card-elevated">
                <Icon className="h-4 w-4 text-muted-2 group-hover:text-purple-bright transition" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white leading-none">{item.label}</p>
                {item.sub && (
                  <p className="mt-0.5 text-[11px] text-muted-2 truncate">{item.sub}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.value && (
                  <span className={`text-xs font-semibold ${item.valueStyle}`}>{item.value}</span>
                )}
                {item.badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple/25 text-[10px] font-bold text-purple-bright ring-1 ring-purple-bright/30">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-2 group-hover:text-white transition" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
