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
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-2 px-5 py-4 sm:px-0 sm:py-0 border-t border-border/45 sm:border-t-0">
      <div>
        Showing {startItem} to {endItem} of {totalItems} {itemName}
      </div>
      <div className="mt-4 sm:mt-0 flex items-center gap-1.5">
        {/* Page Numbers */}
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <span className="text-base leading-none">&laquo;</span>
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
              className={`flex h-8 w-8 items-center justify-center rounded-lg font-medium transition cursor-pointer ${
                currentPage === p
                  ? "bg-purple text-white shadow-[0_4px_12px_rgba(123,44,255,0.25)]"
                  : "border border-border hover:bg-white/[0.04] text-muted-2 hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border hover:bg-white/[0.04] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <span className="text-base leading-none">&raquo;</span>
        </button>

        {/* Page Size */}
        <div className="relative ml-2">
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            className="h-8 rounded-lg border border-border bg-card-elevated pl-2 pr-6 text-xs text-white outline-none appearance-none focus:border-border-strong cursor-pointer transition"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s} / page
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-3 w-3 text-muted-2" />
        </div>
      </div>
    </div>
  );
}
