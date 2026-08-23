import { X, Hash, User, Mail, Wallet, Network, Clock, Activity, Copy, Check, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type TransactionDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: any | null;
};

export function TransactionDetailsModal({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(transaction.referenceTxid || transaction.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDeposit = transaction.type === 'Deposit';
  const accentColor = isDeposit ? 'emerald-500' : 'amber-500';
  const AccentColorText = isDeposit ? 'text-emerald-400' : 'text-amber-400';
  const AccentColorBg = isDeposit ? 'bg-emerald-500/20' : 'bg-amber-500/20';
  const AccentColorRing = isDeposit ? 'ring-emerald-500/30' : 'ring-amber-500/30';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] border border-white/10 bg-card shadow-[0_20px_80px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
        {/* Header Gradient */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/15 to-transparent pointer-events-none" />
        
        <div className="relative flex items-center justify-between border-b border-border/50 p-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Transaction Details</h2>
            <p className="text-xs text-muted-2 mt-1 flex items-center gap-1.5">
              <Hash className="h-3 w-3" />
              {transaction.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer ring-1 ring-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Main Amount Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card-elevated p-5 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-${accentColor}/10 blur-2xl`} />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${AccentColorBg} ${AccentColorText} ring-1 ${AccentColorRing}`}>
                  {isDeposit ? <Wallet className="h-6 w-6" /> : <ArrowRightLeft className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-2 uppercase tracking-wider mb-0.5">
                    {transaction.type} Amount
                  </p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-white tracking-tight">
                      {transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-sm font-semibold ${AccentColorText}`}>{transaction.currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TXID Card */}
          <div className="rounded-xl border border-border bg-card-elevated p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-2 uppercase tracking-wider">
                <Activity className="h-3.5 w-3.5" />
                Reference TXID
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-400 hover:text-white transition bg-blue-500/10 hover:bg-blue-500/30 px-2 py-1 rounded-md cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="font-mono text-sm text-white break-all">{transaction.referenceTxid}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-2 mb-2">
                <User className="h-3.5 w-3.5" /> User Name
              </div>
              <p className="font-semibold text-white">{transaction.userName}</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-2 mb-2">
                <Mail className="h-3.5 w-3.5" /> User Email
              </div>
              <p className="font-semibold text-white truncate" title={transaction.userEmail}>{transaction.userEmail}</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-2 mb-2">
                <Network className="h-3.5 w-3.5" /> Network
              </div>
              <p className="font-semibold text-white">{transaction.network}</p>
            </div>
            
            <div className="rounded-xl border border-border bg-card-elevated p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-2 mb-2">
                <Clock className="h-3.5 w-3.5" /> Date & Time
              </div>
              <p className="font-semibold text-white text-xs">{transaction.dateTime}</p>
            </div>
          </div>
          
          {/* Status Row */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card-elevated p-4">
            <span className="text-xs font-medium text-muted-2 uppercase tracking-wider">Current Status</span>
            <StatusBadge status={transaction.status} />
          </div>

        </div>

        <div className="border-t border-border/50 bg-card-elevated/50 p-5 flex justify-end">
          <Button variant="outline" onClick={onClose} type="button" className="w-full sm:w-auto">
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
}
