import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

type PaginationFooterProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemName?: string;
  pageSizes?: number[];
};

const DEFAULT_PAGE_SIZES = [10, 20, 50];

export function PaginationFooter({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  itemName = "items",
  pageSizes = DEFAULT_PAGE_SIZES,
}: PaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  const goTo = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  const pageNumbers: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i);
    }
    if (currentPage < totalPages - 2) pageNumbers.push("...");
    pageNumbers.push(totalPages);
  }

  const startItem = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 px-5 py-4">
      <div>
        Showing {startItem} to {endItem} of {totalItems} {itemName}
      </div>
      <div className="flex items-center gap-3">
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-muted-2">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goTo(Number(p))}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                  currentPage === p
                    ? "border-purple-bright bg-purple/20 text-purple-bright"
                    : "border-border hover:bg-white/[0.04] text-muted-2"
                }`}
              >
                {p}
              </button>
            )
          )}
          
          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Page Size */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="appearance-none rounded-xl border border-border bg-card-elevated py-1.5 pl-3 pr-8 text-[11px] text-white outline-none transition cursor-pointer"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3.5 w-3.5 text-muted-2" />
        </div>
      </div>
    </div>
  );
}
