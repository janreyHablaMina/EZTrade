type FloatingWithdrawalActionsProps = {
  selectedCount: number;
  onClear: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function FloatingWithdrawalActions({
  selectedCount,
  onClear,
  onApprove,
  onReject,
}: FloatingWithdrawalActionsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-border bg-card-elevated/95 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-2 border-r border-border/50 pr-4">
        <span className="h-2 w-2 rounded-full bg-purple animate-pulse" />
        <p className="text-xs font-semibold text-white">
          {selectedCount} {selectedCount === 1 ? "withdrawal" : "withdrawals"} selected
        </p>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-lg text-muted hover:text-white transition cursor-pointer"
        >
          Clear Selection
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-success/20 bg-success/10 text-success hover:bg-success/20 transition cursor-pointer font-semibold"
        >
          Approve Selected
        </button>
        <button
          type="button"
          onClick={onReject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-danger/20 bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer font-semibold"
        >
          Reject Selected
        </button>
      </div>
    </div>
  );
}
