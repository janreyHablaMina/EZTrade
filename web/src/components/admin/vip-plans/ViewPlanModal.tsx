import { X, Crown, Users, TrendingUp, Calendar, ShieldCheck } from "lucide-react";
import type { VipPlan } from "@/types/admin";

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
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Premium subtle gradient header line */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-bright via-purple to-blue-glow/80" />
        
        <div className="flex items-center justify-between border-b border-border/60 p-6 bg-white/[0.01]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/15 text-purple-bright ring-1 ring-purple-bright/20 shadow-[0_0_15px_rgba(123,44,255,0.15)]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white tracking-tight">Plan Details</h2>
                <span className="inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-purple-bright/20 text-purple-bright border border-purple-bright/30">
                  {plan.level}
                </span>
              </div>
              <p className="text-xs text-muted-2 mt-0.5">Read-only overview of plan configuration.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-2 transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3">
            {/* Deposit Row */}
            <div className="group flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03] hover:border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 transition-colors group-hover:bg-purple/10 group-hover:text-purple-bright">
                  <span className="font-serif text-lg font-bold">$</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">Required Deposit</span>
                  <span className="text-base font-bold text-white tracking-tight">{plan.minDeposit.toLocaleString("en-US")} <span className="text-xs text-muted-2 font-normal">USDT</span></span>
                </div>
              </div>
            </div>

            {/* Daily Profit Row */}
            <div className="group flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03] hover:border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 transition-colors group-hover:bg-success/10 group-hover:text-success">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">Daily Returns</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-success">{plan.dailyProfitPercent.toFixed(2)}%</span>
                    <span className="text-xs text-muted-2">/ day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration Row */}
            <div className="group flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03] hover:border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 transition-colors group-hover:bg-blue-glow/10 group-hover:text-blue-glow">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">Lock Duration</span>
                  <span className="text-base font-bold text-white tracking-tight">{plan.durationDays} <span className="text-xs text-muted-2 font-normal">Days</span></span>
                </div>
              </div>
            </div>

            {/* Active Users Row */}
            <div className="group flex items-center justify-between rounded-xl border border-white/[0.03] bg-white/[0.01] p-4 transition-all hover:bg-white/[0.03] hover:border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 transition-colors group-hover:bg-white/10 group-hover:text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">Subscribed Users</span>
                  <span className="text-base font-bold text-white tracking-tight">{plan.totalUsers.toLocaleString("en-US")}</span>
                </div>
              </div>
            </div>
            
            {/* Metadata Footer */}
            <div className="mt-2 flex items-center justify-between px-2">
               <div className="flex items-center gap-2">
                 <ShieldCheck className="h-3.5 w-3.5 text-muted-2" />
                 <span className="text-xs font-medium text-muted-2">Status:</span>
                 <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    plan.status === "Active"
                      ? "bg-success/15 text-success border border-success/20"
                      : "bg-danger/15 text-danger border border-danger/20"
                  }`}
                 >
                   {plan.status}
                 </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
