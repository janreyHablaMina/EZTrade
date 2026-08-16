import React from "react";
import { X } from "lucide-react";

type GenericFloatingActionsProps = {
  selectedCount: number;
  onClear: () => void;
  children: React.ReactNode;
};

export function GenericFloatingActions({ selectedCount, onClear, children }: GenericFloatingActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-4 rounded-2xl border border-purple-bright/30 bg-card-elevated/95 px-5 py-3 shadow-[0_20px_50px_rgba(123,44,255,0.25)] backdrop-blur-xl">
        <div className="flex items-center gap-3 border-r border-border/50 pr-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple text-xs font-bold text-white">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-white">Selected</span>
        </div>

        <div className="flex items-center gap-2">
          {children}
        </div>

        <div className="ml-2 pl-4 border-l border-border/50">
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-2 hover:text-white transition cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
