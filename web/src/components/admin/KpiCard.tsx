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
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple/15 ring-1 ring-purple-bright/25">
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 text-base font-semibold tracking-tight text-white sm:text-lg">
        {value}
      </p>
      <div
        className={`mt-2 inline-flex items-center gap-1 text-[11px] font-medium ${
          positive ? "text-success" : "text-danger"
        }`}
      >
        {positive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        <span>{change}</span>
        <span className="font-normal text-muted-2">vs last month</span>
      </div>
    </div>
  );
}
