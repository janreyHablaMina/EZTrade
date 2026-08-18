import { Activity, Database, Server, Zap } from "lucide-react";

export function SystemStats({ totalTrades = 0 }: { totalTrades?: number }) {
  const STATS = [
    { label: "Server Uptime", value: "99.9%", icon: Server },
    { label: "Total Trades", value: totalTrades.toLocaleString(), icon: Activity },
    { label: "DB Size", value: "128.4 MB", icon: Database },
    { label: "API Calls (Today)", value: "1.2K", icon: Zap },
  ];

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">System Statistics</h3>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col justify-center rounded-xl border border-border bg-bg-deep/70 p-3"
            >
              <Icon className="mb-2 h-4 w-4 text-purple-bright" />
              <p className="text-[10px] text-muted-2">{stat.label}</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
