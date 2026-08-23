import { useState } from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
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
  Check,
  X,
} from "lucide-react";
import { TableActionsMenu, TableActionsMenuItem, TableActionsMenuDivider } from "@/components/admin/TableActionsMenu";
import type { TransactionRecord } from "@/types/admin";

const typeBadgeStyles: Record<string, string> = {
  Deposit: "bg-blue-500/15 text-blue-400 border border-blue-500/25",
  Withdrawal: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  Transfer: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25",
  Earning: "bg-success/15 text-success border border-success/25",
  Bonus: "bg-purple-bright/15 text-purple-bright border border-purple-bright/25",
};

const statusBadgeStyles: Record<string, string> = {
  Completed: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Failed: "bg-danger/15 text-danger",
  Rejected: "bg-danger/15 text-danger",
};
import { webApi } from "@/lib/api";

type TransactionsTableProps = {
  transactions: TransactionRecord[];
  paginatedTransactions: TransactionRecord[];
  totalCount: number;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  onViewDetails?: (tx: TransactionRecord) => void;
  onRefresh?: () => void;
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
  onRefresh,
}: TransactionsTableProps) {
  const handleUpdateStatus = async (tx: any, status: 'Approved' | 'Rejected') => {
    try {
      await webApi.patch(`/deposits/${tx.dbId}`, { status });
      onRefresh?.();
    } catch (e) {
      console.error('Failed to update deposit status:', e);
    }
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
                      <TableActionsMenu estimatedHeight={200}>
                        {tx.status === 'Pending' && tx.type === 'Deposit' && (
                          <>
                            <TableActionsMenuItem 
                              icon="✅" 
                              label="Approve" 
                              onClick={() => handleUpdateStatus(tx, 'Approved')} 
                              className="text-success" 
                            />
                            <TableActionsMenuItem 
                              icon="❌" 
                              label="Reject" 
                              onClick={() => handleUpdateStatus(tx, 'Rejected')} 
                              className="text-danger" 
                            />
                            <TableActionsMenuDivider />
                          </>
                        )}
                        <TableActionsMenuItem 
                          icon="👁" 
                          label="View Details" 
                          onClick={() => onViewDetails?.(tx)} 
                        />
                      </TableActionsMenu>
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

      <PaginationFooter
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalCount}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemName="transactions"
        pageSizes={[5, 10, 20]}
      />
    </div>
  );
}
