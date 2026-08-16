import { ArrowDown, ArrowUp, ArrowLeftRight } from "lucide-react";
import type { AssetActivity } from "@/lib/mock-data/assetsData";

type RecentActivitiesProps = {
  activities: AssetActivity[];
};

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-border/50">
        <h3 className="text-[13px] font-semibold text-white">Recent Asset Activities</h3>
        <button className="text-[11px] text-purple-bright hover:text-purple transition font-medium">
          View All
        </button>
      </div>
      
      <div className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto max-h-[500px]">
        {activities.map((act) => {
          let Icon = ArrowDown;
          let iconBg = "bg-emerald-500/20";
          let iconColor = "text-emerald-400";
          let amountColor = "text-emerald-400";

          if (act.type === "Withdrawal") {
            Icon = ArrowUp;
            iconBg = "bg-amber-500/20";
            iconColor = "text-amber-400";
            amountColor = "text-white";
          } else if (act.type === "Transfer") {
            Icon = ArrowLeftRight;
            iconBg = "bg-purple-bright/20";
            iconColor = "text-purple-bright";
            amountColor = "text-white";
          }

          return (
            <div key={act.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3.5">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-white mb-0.5">{act.type}</p>
                  <p className="text-[10px] text-muted-2">{act.user}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-[11px] font-semibold ${amountColor} mb-0.5`}>{act.amountText}</p>
                <p className="text-[9px] text-muted-2">{act.dateTime}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border/50">
        <button className="w-full rounded-xl border border-purple-bright/30 bg-purple-bright/10 hover:bg-purple-bright/20 py-2.5 text-xs font-semibold text-purple-bright transition">
          View All Transactions
        </button>
      </div>
    </div>
  );
}
