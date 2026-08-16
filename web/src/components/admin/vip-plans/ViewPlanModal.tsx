import { X, Crown, Users, TrendingUp, Calendar, ShieldCheck } from "lucide-react";
import type { VipPlan } from "@/lib/mock-data/vipPlansData";
import { vipPlanBadgeStyles } from "@/lib/mock-data/vipPlansData";

type ViewPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  plan: VipPlan | null;
};

export function ViewPlanModal({ isOpen, onClose, plan }: ViewPlanModalProps) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Plan Details</h2>
            <span
              className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider ${
                vipPlanBadgeStyles[plan.level] || "bg-white/10 text-muted border border-white/10"
              }`}
            >
              {plan.level}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <span className="text-xs font-medium text-muted-2">Min Deposit</span>
              <span className="text-lg font-semibold text-white">{plan.minDeposit.toLocaleString("en-US")} USDT</span>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <span className="text-xs font-medium text-muted-2">Max Deposit</span>
              <span className="text-lg font-semibold text-white">
                {typeof plan.maxDeposit === "number" ? plan.maxDeposit.toLocaleString("en-US") : plan.maxDeposit} USDT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-2">Daily Profit</span>
                <span className="text-sm font-semibold text-success">{plan.dailyProfitPercent.toFixed(2)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-muted-2">Duration</span>
                <span className="text-sm font-semibold text-white">{plan.durationDays} Days</span>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-2">Engagement & Status</h3>
            
            <div className="mt-2 flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-2">
                <Users className="h-4 w-4" />
                <span>Total Active Users</span>
              </div>
              <span className="font-semibold text-white">{plan.totalUsers.toLocaleString("en-US")}</span>
            </div>

            <div className="flex items-center justify-between border-b border-border/50 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Current Status</span>
              </div>
              <span
                className={`inline-flex rounded-md px-2.5 py-0.5 text-[10px] font-semibold ${
                  plan.status === "Active"
                    ? "bg-success/15 text-success"
                    : "bg-white/[0.06] text-muted-2"
                }`}
              >
                {plan.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2 text-sm text-muted-2">
                <Crown className="h-4 w-4" />
                <span>Internal ID</span>
              </div>
              <span className="font-mono text-xs text-muted">{plan.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
