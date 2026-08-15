type FloatingBulkActionsProps = {
  selectedCount: number;
  onClear: () => void;
  onActionComplete: () => void;
};

export function FloatingBulkActions({
  selectedCount,
  onClear,
  onActionComplete,
}: FloatingBulkActionsProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 rounded-2xl border border-border bg-card-elevated/95 px-5 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-2 border-r border-border/50 pr-4">
        <span className="h-2 w-2 rounded-full bg-purple animate-pulse" />
        <p className="text-xs font-semibold text-white">
          {selectedCount} {selectedCount === 1 ? "user" : "users"} selected
        </p>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-lg text-muted-2 hover:text-white transition cursor-pointer"
        >
          Clear Selection
        </button>
        <button
          type="button"
          onClick={onActionComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-purple/10 text-purple-bright hover:bg-purple/20 transition cursor-pointer"
        >
          <span>⏸</span> Suspend
        </button>
        <button
          type="button"
          onClick={onActionComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-danger/10 text-danger hover:bg-danger/20 transition cursor-pointer"
        >
          <span>🚫</span> Deactivate
        </button>
        <button
          type="button"
          onClick={onActionComplete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-purple-bright/10 text-purple-bright hover:bg-purple-bright/20 transition cursor-pointer"
        >
          <span>🗃️</span> Archive
        </button>
      </div>
    </div>
  );
}
