import { X, TrendingUp, Calendar, CreditCard, User, Wallet, Award } from "lucide-react";
import type { ReferralRecord } from "@/types/admin";

type ReferralDetailsModalProps = {
  referral: ReferralRecord;
  onClose: () => void;
};

export function ReferralDetailsModal({ referral, onClose }: ReferralDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-card/50">
          <div>
            <h2 className="text-lg font-semibold text-white">Referral Details</h2>
            <p className="text-xs text-muted-2 mt-1">Referral ID: {referral.id}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-2 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Referred User Information</h3>
            <div className="flex items-center gap-3 bg-white/[0.02] border border-border/50 p-3 rounded-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-sky-500/20 border border-white/5 font-semibold text-purple-bright shrink-0">
                {referral.userName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{referral.userName}</p>
                <p className="text-xs text-muted-2">{referral.userEmail}</p>
              </div>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Performance Breakdown</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><Wallet className="h-3 w-3" /> Total Deposited</span>
                <span className="text-sm font-semibold text-emerald-400">
                  {referral.totalDeposited.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><Award className="h-3 w-3" /> VIP Level</span>
                <span className="text-sm font-semibold text-purple-bright">
                  VIP {referral.vipLevel}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><TrendingUp className="h-3 w-3" /> Total Earnings</span>
                <span className="text-sm font-semibold text-sky-400">
                  {referral.totalEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><CreditCard className="h-3 w-3" /> Your Commission</span>
                <span className="text-sm font-semibold text-amber-400">
                  {referral.yourCommission.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Registered At</span>
                <span className="text-sm font-medium text-white">{referral.registeredAt}</span>
              </div>
              <div className="bg-white/[0.02] border border-border/50 p-3 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] text-muted-2 flex items-center gap-1.5"><User className="h-3 w-3" /> Commission Status</span>
                <span className="text-sm font-medium text-white">{referral.commissionStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border/50 bg-card/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-border text-sm font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
