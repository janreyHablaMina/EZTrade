import { useState } from "react";
import { X, User, Mail, Phone, Calendar, CheckCircle2, ShieldAlert, CreditCard, Wallet, TrendingUp, Clock, AlertCircle, Users, Check } from "lucide-react";
import { type UserRecord, vipBadgeStyles } from "@/types/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";

type ViewUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserRecord | null;
};

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !user) return null;

  const handleCopy = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white">User Details</h2>
            {user.role === "Ambassador" && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Ambassador
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple/15 text-lg font-semibold text-purple-bright ring-1 ring-purple-bright/20 shrink-0">
              {user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
              <p className="text-xs text-muted-2 mt-1">UID: {user.id.toUpperCase()}</p>
            </div>
            <div className="sm:ml-auto flex flex-wrap gap-2 justify-end">
              {user.pendingDeposit && user.pendingDeposit > 0 && (
                <span 
                  className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-warning/15 text-warning"
                  title={`Pending Deposit: $${user.pendingDeposit}`}
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5" />
                  Deposit Pending
                </span>
              )}
              <StatusBadge status={user.status} />
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold tracking-wider gap-1.5 ${vipBadgeStyles[user.vipLevel] || ""}`}>
                {user.vipLevel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-4 mt-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
              Financial Overview
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-1">
              <div>
                <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> Total Deposits
                </p>
                <p className="text-lg font-bold text-white">
                  ${user.deposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                {user.pendingDeposit && user.pendingDeposit > 0 && (
                  <p className="text-[10px] text-warning mt-0.5">
                    +${user.pendingDeposit.toLocaleString()} pending
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" /> Total Trade
                </p>
                <p className="text-lg font-bold text-white">
                  ${((user as any).totalTrade || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1.5">
                  <Wallet className="h-3 w-3" /> Balance
                </p>
                <p className="text-lg font-bold text-white">
                  ${(user.deposited - user.withdrawn + user.earnings).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1.5">
                  <CreditCard className="h-3 w-3" /> Total Withdrawn
                </p>
                <p className="text-lg font-bold text-white">
                  ${user.withdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-2 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" /> Total Earnings
                </p>
                <p className="text-lg font-bold text-success">
                  +${user.earnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Info */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-4">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
                Contact Information
              </h4>
              
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-muted-2">Email Address</p>
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-2">Phone Number</p>
                  <p className="text-sm font-medium text-white">{user.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-muted-2 shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-2">Joined Date</p>
                  <p className="text-sm font-medium text-white">{user.registeredAt}</p>
                </div>
              </div>
            </div>

            {/* Network & Referrals (Only show if relevant) */}
            {(user.teamSize !== undefined || user.referralCode) && (
              <div className="flex flex-col gap-3 rounded-xl border border-border bg-card-elevated p-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-2 border-b border-border/50 pb-2 mb-1">
                  Network & Referrals
                </h4>
                
                {user.referralCode && (
                  <div className="mt-1 flex items-center justify-between rounded-lg border border-dashed border-purple-bright/30 bg-purple-bright/5 p-2.5">
                    <div>
                      <p className="text-[9px] font-semibold text-purple-bright/80 uppercase tracking-wider">Referral Code</p>
                      <p className="text-sm font-bold text-white font-mono mt-0.5 tracking-wider">{user.referralCode}</p>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex h-7 items-center justify-center rounded-md bg-purple-bright/15 px-3 text-xs font-semibold text-purple-bright hover:bg-purple-bright/25 transition-colors cursor-pointer gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        "Copy"
                      )}
                    </button>
                  </div>
                )}
                
                <div className="flex flex-col gap-3 mt-1">
                  {user.teamSize !== undefined && (
                    <div className="rounded-lg bg-white/[0.02] p-2.5 border border-white/[0.03]">
                      <p className="text-[10px] text-muted-2 mb-1">Total Team Size</p>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-purple-bright" />
                        {user.teamSize.toLocaleString()} Members
                      </p>
                    </div>
                  )}
                  {user.totalDownlineAssets !== undefined && (
                    <div className="rounded-lg bg-white/[0.02] p-2.5 border border-white/[0.03]">
                      <p className="text-[10px] text-muted-2 mb-1">Team Assets</p>
                      <p className="text-sm font-bold text-success flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-success" />
                        ${user.totalDownlineAssets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
