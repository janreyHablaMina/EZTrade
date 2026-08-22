import { X } from "lucide-react";
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
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-semibold text-white">Transaction Details</h2>
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
              <p className="text-muted-2 text-xs mb-1">Transaction ID</p>
              <p className="font-semibold">{transaction.id}</p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Reference TXID</p>
              <p className="font-mono break-all">{transaction.referenceTxid}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">User Name</p>
              <p className="font-semibold">{transaction.userName}</p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">User Email</p>
              <p className="font-semibold">{transaction.userEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Type</p>
              <p className="font-semibold">{transaction.type}</p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Description</p>
              <p className="font-semibold">{transaction.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Amount</p>
              <p className="font-semibold text-lg text-white">
                {transaction.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} {transaction.currency}
              </p>
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Network</p>
              <p className="font-semibold">{transaction.network}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-2 text-xs mb-1">Status</p>
              <StatusBadge status={transaction.status} />
            </div>
            <div>
              <p className="text-muted-2 text-xs mb-1">Date & Time</p>
              <p className="font-semibold">{transaction.dateTime}</p>
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
