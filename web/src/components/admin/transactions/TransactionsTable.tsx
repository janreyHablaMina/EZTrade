import { useState } from "react";
import {
  MoreVertical,
  Copy,
  Eye,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp,
} from "lucide-react";
import type { TransactionRecord } from "./transactionsData";
import { typeBadgeStyles, statusBadgeStyles } from "./transactionsData";

type TransactionsTableProps = {
  transactions: TransactionRecord[];
  paginatedTransactions: TransactionRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  onViewDetails?: (tx: TransactionRecord) => void;
  onPrint?: (tx: TransactionRecord) => void;
  onHistory?: (tx: TransactionRecord) => void;
};

export function TransactionsTable({
  transactions,
  paginatedTransactions,
  totalCount,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  onViewDetails,
  onPrint,
  onHistory,
}: TransactionsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));

  const handleCopyTxid = (id: string, txid: string) => {
    navigator.clipboard.writeText(txid);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderTypeIcon = (type: TransactionRecord["type"]) => {
    switch (type) {
      case "Deposit":
        return <ArrowDownToLine className="h-3 w-3" />;
      case "Withdrawal":
        return <ArrowUpFromLine className="h-3 w-3" />;
      case "Transfer":
        return <ArrowLeftRight className="h-3 w-3" />;
      case "Earning":
        return <TrendingUp className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              <th className="pb-3.5 pl-1 font-medium w-24">ID</th>
              <th className="pb-3.5 font-medium w-28">Type</th>
              <th className="pb-3.5 font-medium w-64">User</th>
              <th className="pb-3.5 font-medium">Reference / TXID</th>
              <th className="pb-3.5 font-medium">Amount</th>
              <th className="pb-3.5 font-medium">Currency</th>
              <th className="pb-3.5 font-medium">Status</th>
              <th className="pb-3.5 font-medium w-40">Date & Time</th>
              <th className="pb-3.5 font-medium text-right pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, index) => {
                const isPositive = tx.amount >= 0;
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition"
                  >
                    <td className="py-3.5 pl-1 font-semibold text-muted-2">
                      {tx.id}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
                          typeBadgeStyles[tx.type] || ""
                        }`}
                      >
                        {renderTypeIcon(tx.type)}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple/15 text-[10px] font-semibold text-purple-bright ring-1 ring-purple-bright/20">
                          {tx.userName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-normal">{tx.userName}</p>
                          <p className="text-[10px] text-muted-2 leading-none mt-0.5">{tx.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2 text-muted-2">
                        <span className="font-mono">
                          {tx.referenceTxid.slice(0, 8)}...{tx.referenceTxid.slice(-8)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTxid(tx.id, tx.referenceTxid)}
                          className="p-1 hover:text-white transition cursor-pointer relative"
                          title="Copy Transaction TXID"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === tx.id && (
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-black/85 text-[8px] text-success font-semibold whitespace-nowrap z-10">
                              Copied!
                            </span>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className={`py-3.5 font-bold ${isPositive ? "text-success" : "text-danger"}`}>
                      {isPositive ? "+" : ""}
                      {tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-4.5 w-4.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold ring-1 ring-emerald-500/30">
                          T
                        </div>
                        <div>
                          <span className="font-semibold text-white">{tx.currency}</span>
                          <span className="ml-1.5 inline-flex rounded bg-card-elevated px-1 py-0.5 text-[8px] font-medium text-muted-2 tracking-wide ring-1 ring-border/50">
                            {tx.network}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          statusBadgeStyles[tx.status] || ""
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-muted-2">{tx.dateTime}</td>
                    <td className="py-3.5 text-right pr-1 relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(
                            activeDropdownId === tx.id ? null : tx.id
                          );
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border bg-card-elevated transition cursor-pointer ml-auto ${
                          activeDropdownId === tx.id
                            ? "border-purple-bright/50 text-white bg-purple/10"
                            : "border-border text-muted hover:text-white"
                        }`}
                        aria-label="More options"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>

                      {activeDropdownId === tx.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-20 cursor-default" 
                            onClick={() => setActiveDropdownId(null)}
                          />
                          <div className={`absolute right-1.5 w-44 rounded-xl bg-card-elevated border border-border py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.55)] z-30 text-left ${
                            index >= paginatedTransactions.length - 4 && paginatedTransactions.length > 4
                              ? "bottom-full mb-1"
                              : "mt-1"
                          }`}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onViewDetails?.(tx);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <Eye className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onPrint?.(tx);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <Printer className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              Print Receipt
                            </button>
                            <div className="my-1 border-t border-border/45" />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                onHistory?.(tx);
                              }}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted hover:bg-white/[0.04] hover:text-white transition cursor-pointer text-left font-medium"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-2 mr-2 inline" />
                              History / Logs
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-8 text-center text-muted-2">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-2 border-t border-border/45 pt-4">
        <div>
          Showing {transactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, transactions.length)} of{" "}
          <span className="text-white font-medium">
            {transactions.length === totalCount ? "5,620" : transactions.length}
          </span>{" "}
          transactions
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-purple border-purple-bright/35 text-white shadow-[0_4px_12px_rgba(123,44,255,0.3)]"
                      : "border-border bg-card-elevated text-muted hover:text-white"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-elevated text-muted hover:text-white transition disabled:opacity-40 disabled:hover:text-muted cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-lg border border-border bg-card-elevated pl-2.5 pr-8 text-xs text-white outline-none focus:border-border-strong transition appearance-none cursor-pointer"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-4 w-4 text-muted-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
