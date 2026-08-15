import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  change: string;
  positive?: boolean;
  icon: LucideIcon;
  iconClassName?: string;
};

export function KpiCard({
  label,
  value,
  change,
  positive = true,
  icon: Icon,
  iconClassName = "text-purple-bright",
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple/15 ring-1 ring-purple-bright/25">
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {value}
      </p>
      <div
        className={`mt-3 inline-flex items-center gap-1 text-xs font-medium ${
          positive ? "text-success" : "text-danger"
        }`}
      >
        {positive ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5" />
        )}
        <span>{change}</span>
        <span className="font-normal text-muted-2">vs last month</span>
      </div>
    </div>
  );
}
