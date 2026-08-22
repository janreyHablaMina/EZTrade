import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DepositRecord } from "@/types/admin";

type DepositDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deposit: DepositRecord | null;
};

export function DepositDetailsModal({
  isOpen,
  onClose,
  deposit,
}: DepositDetailsModalProps) {
  if (!isOpen || !deposit) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-white">Deposit Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 text-sm text-white space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Transaction ID (TXID)</p>
              <p className="font-mono break-all bg-black/20 p-2 rounded-lg border border-white/5">{deposit.txid}</p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Deposit ID</p>
              <p className="font-semibold">{deposit.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">User Name</p>
              <p className="font-semibold">{deposit.userName}</p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">User Email</p>
              <p className="font-semibold">{deposit.userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Amount</p>
              <p className="font-semibold text-lg text-emerald-400">
                {deposit.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {deposit.currency}
              </p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Network</p>
              <p className="font-semibold">{deposit.network}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Status</p>
              <StatusBadge status={deposit.status} />
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Submitted At</p>
              <p className="font-semibold">{deposit.submittedAt}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" onClick={onClose} type="button">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
